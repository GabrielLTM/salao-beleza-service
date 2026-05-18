import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';

export class Cliente {
  constructor({ id = randomUUID(), nomeCompleto, whatsApp, dataNascimento = null, endereco = null }) {
    Cliente.validar({ nomeCompleto, whatsApp });
    this.id = id;
    this.nomeCompleto = nomeCompleto.trim();
    this.whatsApp = whatsApp.trim();
    this.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    this.endereco = endereco?.trim() ?? null;
  }

  static validar({ nomeCompleto, whatsApp }) {
    const erros = [];
    if (!nomeCompleto || nomeCompleto.trim().length < 2) erros.push('nomeCompleto eh obrigatorio.');
    if (!whatsApp || whatsApp.trim().length < 8) erros.push('whatsApp invalido.');
    if (erros.length > 0) throw new ValidationError('Cliente invalido.', erros);
  }
}
