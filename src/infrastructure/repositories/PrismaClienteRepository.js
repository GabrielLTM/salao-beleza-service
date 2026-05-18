import { IClienteRepository } from '../../domain/repositories/IClienteRepository.js';

export class PrismaClienteRepository extends IClienteRepository {
  constructor(prisma) { super(); this.prisma = prisma; }

  async listar({ pagina, tamanho }) {
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({
        skip: (pagina - 1) * tamanho,
        take: tamanho,
        orderBy: { nomeCompleto: 'asc' },
      }),
      this.prisma.cliente.count(),
    ]);
    return { itens, total };
  }

  buscarPorId(id) { return this.prisma.cliente.findUnique({ where: { id } }); }
  criar(registro) { return this.prisma.cliente.create({ data: registro }); }

  atualizar(registro) {
    const { id, ...resto } = registro;
    return this.prisma.cliente.update({ where: { id }, data: resto });
  }

  async excluir(id) { await this.prisma.cliente.delete({ where: { id } }); }
}
