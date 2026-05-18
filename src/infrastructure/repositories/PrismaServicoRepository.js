import { IServicoRepository } from '../../domain/repositories/IServicoRepository.js';

export class PrismaServicoRepository extends IServicoRepository {
  constructor(prisma) { super(); this.prisma = prisma; }

  async listarComCategoria({ pagina, tamanho }) {
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.servico.findMany({
        skip: (pagina - 1) * tamanho,
        take: tamanho,
        orderBy: { nome: 'asc' },
        include: { categoria: true },
      }),
      this.prisma.servico.count(),
    ]);
    return { itens, total };
  }

  buscarPorIdComCategoria(id) {
    return this.prisma.servico.findUnique({ where: { id }, include: { categoria: true } });
  }

  buscarPorId(id) {
    return this.prisma.servico.findUnique({ where: { id } });
  }

  buscarVariosPorIds(ids) {
    return this.prisma.servico.findMany({ where: { id: { in: ids } } });
  }

  criar(registro) { return this.prisma.servico.create({ data: registro }); }

  atualizar(registro) {
    const { id, ...resto } = registro;
    return this.prisma.servico.update({ where: { id }, data: resto });
  }

  async excluir(id) { await this.prisma.servico.delete({ where: { id } }); }

  async definirCategoriaParaIds(ids, categoriaId) {
    await this.prisma.servico.updateMany({
      where: { id: { in: ids } },
      data: { categoriaId },
    });
  }
}
