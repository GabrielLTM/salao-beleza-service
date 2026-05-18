export class FaturamentoPorPeriodo {
  constructor({ vendaRepository }) { this.vendaRepository = vendaRepository; }
  async executar({ inicio, fim }) {
    const total = await this.vendaRepository.somarTotalNoPeriodo(inicio, fim);
    return {
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      total,
    };
  }
}
