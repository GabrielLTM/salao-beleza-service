function decimalParaNumero(d) {
  if (d === null || d === undefined) return 0;
  if (typeof d === 'number') return d;
  return Number(d.toString());
}

export const VendaMapper = {
  paraDto(v) {
    if (!v) return null;
    return {
      id: v.id,
      dataHora: v.dataHora instanceof Date ? v.dataHora.toISOString() : v.dataHora,
      total: decimalParaNumero(v.total),
      funcionarioId: v.funcionarioId,
      clienteId: v.clienteId ?? null,
      itens: (v.itens ?? []).map((i) => ({
        id: i.id,
        tipo: i.tipo,
        produtoId: i.produtoId ?? null,
        servicoId: i.servicoId ?? null,
        quantidade: i.quantidade,
        valorUnitario: decimalParaNumero(i.valorUnitario),
        percentualComissaoBase: decimalParaNumero(i.percentualComissaoBase),
        percentualComissaoFuncionario: decimalParaNumero(i.percentualComissaoFuncionario),
        valorComissao: decimalParaNumero(i.valorComissao),
      })),
    };
  },
};
