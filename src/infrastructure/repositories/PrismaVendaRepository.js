import { IVendaRepository } from '../../domain/repositories/IVendaRepository.js';

export class PrismaVendaRepository extends IVendaRepository {
  constructor(prisma) { super(); this.prisma = prisma; }

  async listar({ pagina, tamanho, funcionarioId, clienteId }) {
    const where = {};
    if (funcionarioId) where.funcionarioId = funcionarioId;
    if (clienteId) where.clienteId = clienteId;
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.venda.findMany({
        where,
        skip: (pagina - 1) * tamanho,
        take: tamanho,
        orderBy: { dataHora: 'desc' },
        include: { itens: true },
      }),
      this.prisma.venda.count({ where }),
    ]);
    return { itens, total };
  }

  buscarPorId(id) {
    return this.prisma.venda.findUnique({ where: { id }, include: { itens: true } });
  }

  async criar(registro) {
    return this.prisma.$transaction(async (tx) => {
      const venda = await tx.venda.create({
        data: {
          id: registro.id,
          dataHora: registro.dataHora,
          total: registro.total,
          funcionarioId: registro.funcionarioId,
          clienteId: registro.clienteId,
        },
      });
      if (registro.itens?.length) {
        await tx.itemVenda.createMany({
          data: registro.itens.map((i) => ({
            id: i.id,
            vendaId: venda.id,
            tipo: i.tipo,
            produtoId: i.produtoId,
            servicoId: i.servicoId,
            quantidade: i.quantidade,
            valorUnitario: i.valorUnitario,
          })),
        });
      }
      return tx.venda.findUnique({ where: { id: venda.id }, include: { itens: true } });
    });
  }

  async somarTotalNoPeriodo(inicio, fim) {
    const r = await this.prisma.venda.aggregate({
      _sum: { total: true },
      where: { dataHora: { gte: inicio, lte: fim } },
    });
    return r._sum.total ? Number(r._sum.total.toString()) : 0;
  }

  async faturamentoPorFuncionario(inicio, fim) {
    const r = await this.prisma.venda.groupBy({
      by: ['funcionarioId'],
      _sum: { total: true },
      where: { dataHora: { gte: inicio, lte: fim } },
    });
    return r.map((linha) => ({
      funcionarioId: linha.funcionarioId,
      total: linha._sum.total ? Number(linha._sum.total.toString()) : 0,
    }));
  }

  async rankingServicosVendidos(inicio, fim, limite = 10) {
    const r = await this.prisma.itemVenda.groupBy({
      by: ['servicoId'],
      _sum: { quantidade: true },
      where: {
        tipo: 'SERVICO',
        servicoId: { not: null },
        venda: { dataHora: { gte: inicio, lte: fim } },
      },
      orderBy: { _sum: { quantidade: 'desc' } },
      take: limite,
    });
    return r.map((linha) => ({
      servicoId: linha.servicoId,
      quantidade: linha._sum.quantidade ?? 0,
    }));
  }
}
