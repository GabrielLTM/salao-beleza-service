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
            percentualComissaoBase: i.percentualComissaoBase ?? 0,
            percentualComissaoFuncionario: i.percentualComissaoFuncionario ?? 0,
            valorComissao: i.valorComissao ?? 0,
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

  async comissaoPorFuncionario(inicio, fim) {
    // groupBy do Prisma/MongoDB nao agrega por campo de relacao (venda.funcionarioId a partir
    // do itemVenda), entao buscamos as vendas do periodo com os itens e somamos em memoria.
    // Volume de um salao torna isso adequado.
    const vendas = await this.prisma.venda.findMany({
      where: { dataHora: { gte: inicio, lte: fim } },
      select: { funcionarioId: true, itens: { select: { tipo: true, valorComissao: true } } },
    });

    const porFuncionario = new Map();
    for (const venda of vendas) {
      const acc = porFuncionario.get(venda.funcionarioId) ?? { total: 0, produto: 0, servico: 0 };
      for (const item of venda.itens) {
        const valor = item.valorComissao ? Number(item.valorComissao.toString()) : 0;
        acc.total += valor;
        if (item.tipo === 'PRODUTO') acc.produto += valor;
        else if (item.tipo === 'SERVICO') acc.servico += valor;
      }
      porFuncionario.set(venda.funcionarioId, acc);
    }

    return [...porFuncionario.entries()].map(([funcionarioId, v]) => ({
      funcionarioId,
      comissaoTotal: Math.round(v.total * 100) / 100,
      comissaoProduto: Math.round(v.produto * 100) / 100,
      comissaoServico: Math.round(v.servico * 100) / 100,
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
