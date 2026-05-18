function decimalParaNumero(d) {
  if (d === null || d === undefined) return 0;
  if (typeof d === 'number') return d;
  return Number(d.toString());
}

export const ServicoMapper = {
  paraDto(s) {
    if (!s) return null;
    return {
      id: s.id,
      nome: s.nome,
      duracaoMinutos: s.duracaoMinutos,
      precoMinimo: decimalParaNumero(s.precoMinimo),
      categoriaId: s.categoriaId,
      nomeCategoria: s.categoria?.nome ?? s.nomeCategoria ?? null,
      status: s.status,
    };
  },
};
