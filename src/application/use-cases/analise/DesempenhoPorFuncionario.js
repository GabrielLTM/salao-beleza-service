/**
 * Resumo simples por funcionario no periodo informado.
 * Para cada funcionario ativo retorna:
 *   - id, nomeCompleto, nivelPermissao
 *   - agendamentosConcluidos: count
 *   - totalFaturado: soma de vendas em que o funcionario participou
 */
export class DesempenhoPorFuncionario {
  constructor({ funcionarioRepository, agendamentoRepository, vendaRepository }) {
    this.funcionarioRepository = funcionarioRepository;
    this.agendamentoRepository = agendamentoRepository;
    this.vendaRepository = vendaRepository;
  }

  async executar({ inicio, fim }) {
    const { itens: funcionarios } = await this.funcionarioRepository.listar({ pagina: 1, tamanho: 1000 });
    const faturamentos = await this.vendaRepository.faturamentoPorFuncionario(inicio, fim);
    const mapFat = new Map(faturamentos.map((f) => [f.funcionarioId, f.total]));

    const linhas = await Promise.all(
      funcionarios.map(async (f) => ({
        id: f.id,
        nomeCompleto: f.nomeCompleto,
        nivelPermissao: f.nivelPermissao,
        agendamentosConcluidos: await this.agendamentoRepository.contarPorFuncionarioConcluidos(f.id, inicio, fim),
        totalFaturado: mapFat.get(f.id) ?? 0,
      })),
    );

    return {
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      funcionarios: linhas.sort((a, b) => b.totalFaturado - a.totalFaturado),
    };
  }
}
