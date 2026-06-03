import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';

export const StatusAgendamento = Object.freeze({
  AGENDADO: 'AGENDADO',
  CONCLUIDO: 'CONCLUIDO',
  CANCELADO: 'CANCELADO',
});

export class Agendamento {
  constructor({
    id = randomUUID(),
    clienteId,
    funcionarioId,
    servicoIds,
    dataHoraInicio,
    dataHoraFim,
    status = StatusAgendamento.AGENDADO,
  }) {
    const erros = [];
    if (!clienteId) erros.push('clienteId eh obrigatorio.');
    if (!funcionarioId) erros.push('funcionarioId eh obrigatorio.');
    if (!Array.isArray(servicoIds) || servicoIds.length === 0) {
      erros.push('servicoIds deve conter pelo menos um servico.');
    }
    const inicio = dataHoraInicio instanceof Date ? dataHoraInicio : new Date(dataHoraInicio);
    const fim = dataHoraFim instanceof Date ? dataHoraFim : new Date(dataHoraFim);
    if (Number.isNaN(inicio.getTime())) erros.push('dataHoraInicio invalida.');
    if (Number.isNaN(fim.getTime())) erros.push('dataHoraFim invalida.');
    if (!Number.isNaN(inicio.getTime()) && !Number.isNaN(fim.getTime()) && inicio.getTime() >= fim.getTime()) {
      erros.push('dataHoraInicio deve ser anterior a dataHoraFim.');
    }
    if (!Object.values(StatusAgendamento).includes(status)) {
      erros.push(`status deve ser um entre: ${Object.values(StatusAgendamento).join(', ')}`);
    }
    if (erros.length > 0) throw new ValidationError('Agendamento invalido.', erros);

    this.id = id;
    this.clienteId = clienteId;
    this.funcionarioId = funcionarioId;
    this.servicoIds = Array.isArray(servicoIds) ? [...servicoIds] : [];
    this.dataHoraInicio = inicio;
    this.dataHoraFim = fim;
    this.status = status;
  }

  estaAtivo() {
    return this.status !== StatusAgendamento.CANCELADO;
  }
}
