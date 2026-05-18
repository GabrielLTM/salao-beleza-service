import { IAgendamentoRepository } from '../../domain/repositories/IAgendamentoRepository.js';

const STATUS_CANCELADO = 'CANCELADO';
const STATUS_CONCLUIDO = 'CONCLUIDO';

export class PrismaAgendamentoRepository extends IAgendamentoRepository {
  constructor(prisma) { super(); this.prisma = prisma; }

  async listar({ pagina, tamanho, funcionarioId, clienteId, inicio, fim }) {
    const where = {};
    if (funcionarioId) where.funcionarioId = funcionarioId;
    if (clienteId) where.clienteId = clienteId;
    if (inicio || fim) {
      where.dataHoraInicio = {};
      if (inicio) where.dataHoraInicio.gte = inicio;
      if (fim) where.dataHoraInicio.lte = fim;
    }
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.agendamento.findMany({
        where,
        skip: (pagina - 1) * tamanho,
        take: tamanho,
        orderBy: { dataHoraInicio: 'asc' },
      }),
      this.prisma.agendamento.count({ where }),
    ]);
    return { itens, total };
  }

  buscarPorId(id) {
    return this.prisma.agendamento.findUnique({ where: { id } });
  }

  criar(registro) { return this.prisma.agendamento.create({ data: registro }); }

  atualizar(registro) {
    const { id, ...resto } = registro;
    return this.prisma.agendamento.update({ where: { id }, data: resto });
  }

  cancelar(id) {
    return this.prisma.agendamento.update({ where: { id }, data: { status: STATUS_CANCELADO } });
  }

  async excluir(id) { await this.prisma.agendamento.delete({ where: { id } }); }

  buscarConflitos(funcionarioId, inicio, fim, excluirId) {
    const where = {
      funcionarioId,
      status: { not: STATUS_CANCELADO },
      AND: [
        { dataHoraInicio: { lt: fim } },
        { dataHoraFim: { gt: inicio } },
      ],
    };
    if (excluirId) where.id = { not: excluirId };
    return this.prisma.agendamento.findMany({ where });
  }

  contarPorFuncionarioConcluidos(funcionarioId, inicio, fim) {
    return this.prisma.agendamento.count({
      where: {
        funcionarioId,
        status: STATUS_CONCLUIDO,
        dataHoraInicio: { gte: inicio, lte: fim },
      },
    });
  }
}
