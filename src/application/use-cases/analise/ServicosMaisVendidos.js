export class ServicosMaisVendidos {
  constructor({ vendaRepository, servicoRepository }) {
    this.vendaRepository = vendaRepository;
    this.servicoRepository = servicoRepository;
  }

  async executar({ inicio, fim, limite = 10 }) {
    const ranking = await this.vendaRepository.rankingServicosVendidos(inicio, fim, limite);
    const ids = ranking.map((r) => r.servicoId).filter(Boolean);
    const servicos = ids.length ? await this.servicoRepository.buscarVariosPorIds(ids) : [];
    const mapNome = new Map(servicos.map((s) => [s.id, s.nome]));

    return {
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      itens: ranking.map((r) => ({
        servicoId: r.servicoId,
        nome: mapNome.get(r.servicoId) ?? null,
        quantidade: r.quantidade,
      })),
    };
  }
}
