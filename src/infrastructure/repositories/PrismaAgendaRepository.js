import { IAgendaRepository } from '../../domain/repositories/IAgendaRepository.js';

export class PrismaAgendaRepository extends IAgendaRepository {
  constructor(prisma) { super(); this.prisma = prisma; }

  listarPorFuncionario(funcionarioId) {
    return this.prisma.agendaFuncionario.findMany({
      where: { funcionarioId },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  listarPorFuncionarioEDia(funcionarioId, diaSemana) {
    return this.prisma.agendaFuncionario.findMany({
      where: { funcionarioId, diaSemana },
      orderBy: [{ horaInicio: 'asc' }],
    });
  }

  buscarJanelaPorId(id) {
    return this.prisma.agendaFuncionario.findUnique({ where: { id } });
  }

  async definirJanelasParaFuncionario(funcionarioId, janelas) {
    return this.prisma.$transaction(async (tx) => {
      await tx.agendaFuncionario.deleteMany({ where: { funcionarioId } });
      if (janelas.length > 0) {
        await tx.agendaFuncionario.createMany({ data: janelas });
      }
      return tx.agendaFuncionario.findMany({
        where: { funcionarioId },
        orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
      });
    });
  }

  async removerJanela(id) {
    await this.prisma.agendaFuncionario.delete({ where: { id } });
  }
}
