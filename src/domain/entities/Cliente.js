import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Cliente {
  constructor({
    id = randomUUID(),
    nomeCompleto,
    whatsApp,
    profissao = [],
    email = null,
    instagram = null,
    facebook = null,
    dataNascimento = null,
    endereco = null,
  }) {
    Cliente.validar({ nomeCompleto, whatsApp, email });
    this.id = id;
    this.nomeCompleto = nomeCompleto.trim();
    this.whatsApp = whatsApp.trim();
    this.profissao = Array.isArray(profissao)
      ? profissao.map((p) => p.trim()).filter((p) => p.length > 0)
      : [];
    this.email = email ? email.trim().toLowerCase() : null;
    this.instagram = instagram?.trim() ?? null;
    this.facebook = facebook?.trim() ?? null;
    this.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    this.endereco = endereco?.trim() ?? null;
  }

  static validar({ nomeCompleto, whatsApp, email }) {
    const erros = [];
    if (!nomeCompleto || nomeCompleto.trim().length < 2) erros.push('nomeCompleto eh obrigatorio.');
    if (!whatsApp || whatsApp.trim().length < 8) erros.push('whatsApp invalido.');
    if (email && !EMAIL_REGEX.test(email.trim())) erros.push('email invalido.');
    if (erros.length > 0) throw new ValidationError('Cliente invalido.', erros);
  }
}
