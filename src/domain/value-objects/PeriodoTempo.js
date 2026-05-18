import { ValidationError } from '../errors/ValidationError.js';

export class PeriodoTempo {
  /**
   * @param {Date} inicio
   * @param {Date} fim
   */
  constructor(inicio, fim) {
    if (!(inicio instanceof Date) || Number.isNaN(inicio.getTime())) {
      throw new ValidationError('Periodo invalido.', ['inicio deve ser uma data valida']);
    }
    if (!(fim instanceof Date) || Number.isNaN(fim.getTime())) {
      throw new ValidationError('Periodo invalido.', ['fim deve ser uma data valida']);
    }
    if (inicio.getTime() >= fim.getTime()) {
      throw new ValidationError('Periodo invalido.', ['inicio deve ser anterior a fim']);
    }
    this.inicio = inicio;
    this.fim = fim;
  }

  /**
   * Verifica se este periodo se sobrepoe a outro.
   * Sobreposicao = inicioA < fimB AND fimA > inicioB.
   * @param {PeriodoTempo} outro
   */
  sobreposicao(outro) {
    return this.inicio.getTime() < outro.fim.getTime() && this.fim.getTime() > outro.inicio.getTime();
  }
}
