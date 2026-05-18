import { IFuncionarioRepository } from '../../domain/repositories/IFuncionarioRepository.js';

export class PrismaFuncionarioRepository extends IFuncionarioRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async listar({ pagina, tamanho }) {
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.funcionario.findMany({
        skip: (pagina - 1) * tamanho,
        take: tamanho,
        orderBy: { nomeCompleto: 'asc' },
      }),
      this.prisma.funcionario.count(),
    ]);
    return { itens, total };
  }

  buscarPorId(id) {
    return this.prisma.funcionario.findUnique({ where: { id } });
  }

  buscarPorEmail(email) {
    return this.prisma.funcionario.findUnique({ where: { email } });
  }

  criar(registro) {
    return this.prisma.funcionario.create({ data: registro });
  }

  atualizar(registro) {
    const { id, ...resto } = registro;
    return this.prisma.funcionario.update({ where: { id }, data: resto });
  }

  async excluir(id) {
    await this.prisma.funcionario.delete({ where: { id } });
  }
}
