import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';

const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class JanelaAgenda {
  constructor({ id = randomUUID(), funcionarioId, diaSemana, horaInicio, horaFim }) {
    const erros = [];
    if (!funcionarioId) erros.push('funcionarioId eh obrigatorio.');
    if (!Number.isInteger(diaSemana) || diaSemana < 0 || diaSemana > 6) {
      erros.push('diaSemana deve ser um inteiro entre 0 (domingo) e 6 (sabado).');
    }
    if (!HORA_REGEX.test(horaInicio)) erros.push('horaInicio invalida (formato HH:mm).');
    if (!HORA_REGEX.test(horaFim)) erros.push('horaFim invalida (formato HH:mm).');
    if (HORA_REGEX.test(horaInicio) && HORA_REGEX.test(horaFim) && horaInicio >= horaFim) {
      erros.push('horaInicio deve ser anterior a horaFim.');
    }
    if (erros.length > 0) throw new ValidationError('Janela de agenda invalida.', erros);

    this.id = id;
    this.funcionarioId = funcionarioId;
    this.diaSemana = diaSemana;
    this.horaInicio = horaInicio;
    this.horaFim = horaFim;
  }

  /**
   * Verifica se um par (HH:mm, HH:mm) esta inteiramente contido nesta janela.
   * @param {string} inicio "HH:mm"
   * @param {string} fim    "HH:mm"
   */
  contemIntervalo(inicio, fim) {
    return inicio >= this.horaInicio && fim <= this.horaFim;
  }
}
