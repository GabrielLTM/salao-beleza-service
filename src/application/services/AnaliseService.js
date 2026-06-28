/**
 * Service de Analise de Desempenho.
 * Concentra os 3 relatorios simples agregando dados ja existentes.
 */
export class AnaliseService {
  /**
   * @param {{
   *   funcionarioRepository:any,
   *   agendamentoRepository:any,
   *   vendaRepository:any,
   *   servicoRepository:any,
   * }} deps
   */
  constructor({ funcionarioRepository, agendamentoRepository, vendaRepository, servicoRepository }) {
    this.funcionarioRepository = funcionarioRepository;
    this.agendamentoRepository = agendamentoRepository;
    this.vendaRepository = vendaRepository;
    this.servicoRepository = servicoRepository;
  }

  async desempenhoPorFuncionario({ inicio, fim }) {
    const { itens: funcionarios } = await this.funcionarioRepository.listar({ pagina: 1, tamanho: 1000 });
    const faturamentos = await this.vendaRepository.faturamentoPorFuncionario(inicio, fim);
    const mapFat = new Map(faturamentos.map((f) => [f.funcionarioId, f.total]));

    const comissoes = await this.vendaRepository.comissaoPorFuncionario(inicio, fim);
    const mapComissao = new Map(comissoes.map((c) => [c.funcionarioId, c]));

    const linhas = await Promise.all(
      funcionarios.map(async (f) => {
        const comissao = mapComissao.get(f.id);
        return {
          id: f.id,
          nomeCompleto: f.nomeCompleto,
          nivelPermissao: f.nivelPermissao,
          agendamentosConcluidos: await this.agendamentoRepository.contarPorFuncionarioConcluidos(f.id, inicio, fim),
          totalFaturado: mapFat.get(f.id) ?? 0,
          totalComissao: comissao?.comissaoTotal ?? 0,
          comissaoProduto: comissao?.comissaoProduto ?? 0,
          comissaoServico: comissao?.comissaoServico ?? 0,
        };
      }),
    );

    return {
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      funcionarios: linhas.sort((a, b) => b.totalFaturado - a.totalFaturado),
    };
  }

  async servicosMaisVendidos({ inicio, fim, limite = 10 }) {
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

  async faturamentoPorPeriodo({ inicio, fim }) {
    const total = await this.vendaRepository.somarTotalNoPeriodo(inicio, fim);
    return { inicio: inicio.toISOString(), fim: fim.toISOString(), total };
  }
}
