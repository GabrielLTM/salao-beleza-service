import { IProdutoRepository } from '../../domain/repositories/IProdutoRepository.js';

export class PrismaProdutoRepository extends IProdutoRepository {
  constructor(prisma) { super(); this.prisma = prisma; }

  async listar({ pagina, tamanho }) {
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.produto.findMany({
        skip: (pagina - 1) * tamanho,
        take: tamanho,
        orderBy: { nome: 'asc' },
      }),
      this.prisma.produto.count(),
    ]);
    return { itens, total };
  }

  buscarPorId(id) { return this.prisma.produto.findUnique({ where: { id } }); }
  buscarVariosPorIds(ids) { return this.prisma.produto.findMany({ where: { id: { in: ids } } }); }
  criar(registro) { return this.prisma.produto.create({ data: registro }); }
  atualizar(registro) {
    const { id, ...resto } = registro;
    return this.prisma.produto.update({ where: { id }, data: resto });
  }
  async excluir(id) { await this.prisma.produto.delete({ where: { id } }); }
}
