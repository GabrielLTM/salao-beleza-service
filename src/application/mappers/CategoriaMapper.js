export const CategoriaMapper = {
  paraDto(c) {
    if (!c) return null;
    const servicos = c.servicos ?? [];
    return {
      id: c.id,
      nome: c.nome,
      servicoIds: servicos.map((s) => s.id),
      nomesServicosVinculados: servicos.map((s) => s.nome),
    };
  },
};
