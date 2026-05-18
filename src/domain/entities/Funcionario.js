import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';
import { validarNivelPermissao } from '../value-objects/NivelPermissao.js';
import { validarStatus, Status } from '../value-objects/Status.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Funcionario {
  constructor({
    id = randomUUID(),
    nomeCompleto,
    endereco = null,
    telefone = null,
    profissaoCargo,
    email,
    senhaHash,
    dataNascimento = null,
    nivelPermissao,
    status,
  }) {
    Funcionario.validar({ nomeCompleto, profissaoCargo, email, nivelPermissao, status });
    this.id = id;
    this.nomeCompleto = nomeCompleto.trim();
    this.endereco = endereco?.trim() ?? null;
    this.telefone = telefone?.trim() ?? null;
    this.profissaoCargo = profissaoCargo.trim();
    this.email = email.trim().toLowerCase();
    this.senhaHash = senhaHash;
    this.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    this.nivelPermissao = nivelPermissao;
    this.status = status;
  }

  static validar({ nomeCompleto, profissaoCargo, email, nivelPermissao, status }) {
    const erros = [];
    if (!nomeCompleto || nomeCompleto.trim().length < 2) erros.push('nomeCompleto eh obrigatorio.');
    if (!profissaoCargo || profissaoCargo.trim().length < 2) erros.push('profissaoCargo eh obrigatorio.');
    if (!email || !EMAIL_REGEX.test(email)) erros.push('email invalido.');
    if (erros.length > 0) throw new ValidationError('Funcionario invalido.', erros);
    validarNivelPermissao(nivelPermissao);
    validarStatus(status);
  }

  estaAtivo() {
    return this.status === Status.ATIVO;
  }
}
