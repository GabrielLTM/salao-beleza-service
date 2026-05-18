import { ICategoriaRepository } from '../../domain/repositories/ICategoriaRepository.js';

export class PrismaCategoriaRepository extends ICategoriaRepository {
  constructor(prisma) { super(); this.prisma = prisma; }

  async listarComServicos({ pagina, tamanho }) {
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.categoria.findMany({
        skip: (pagina - 1) * tamanho,
        take: tamanho,
        orderBy: { nome: 'asc' },
        include: { servicos: { select: { id: true, nome: true } } },
      }),
      this.prisma.categoria.count(),
    ]);
    return { itens, total };
  }

  buscarPorIdComServicos(id) {
    return this.prisma.categoria.findUnique({
      where: { id },
      include: { servicos: { select: { id: true, nome: true } } },
    });
  }

  criar({ id, nome }) { return this.prisma.categoria.create({ data: { id, nome } }); }

  atualizar({ id, nome }) {
    return this.prisma.categoria.update({ where: { id }, data: { nome } });
  }

  async excluir(id) { await this.prisma.categoria.delete({ where: { id } }); }
}
