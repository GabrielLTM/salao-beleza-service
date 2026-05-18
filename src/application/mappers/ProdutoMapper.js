function decimalParaNumero(d) {
  if (d === null || d === undefined) return 0;
  if (typeof d === 'number') return d;
  return Number(d.toString());
}

export const ProdutoMapper = {
  paraDto(p) {
    if (!p) return null;
    return {
      id: p.id,
      nome: p.nome,
      valor: decimalParaNumero(p.valor),
      caminhoImagem: p.caminhoImagem ?? null,
      status: p.status,
    };
  },
};
