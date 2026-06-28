import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';
import { validarNivelPermissao } from '../value-objects/NivelPermissao.js';
import { validarStatus, Status } from '../value-objects/Status.js';
import { percentualValido } from '../value-objects/Percentual.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizarCpf(cpf) {
  if (cpf == null) return null;
  const apenasDigitos = String(cpf).replace(/\D/g, '');
  return apenasDigitos.length > 0 ? apenasDigitos : null;
}

export class Funcionario {
  constructor({
    id = randomUUID(),
    nomeCompleto,
    cpf = null,
    endereco = null,
    telefone = null,
    profissoes,
    email,
    senhaHash,
    dataNascimento = null,
    dataAdmissao = null,
    nivelPermissao,
    status,
    percentualComissaoProduto = 0,
    percentualComissaoServico = 0,
  }) {
    Funcionario.validar({
      nomeCompleto,
      cpf,
      profissoes,
      email,
      nivelPermissao,
      status,
      percentualComissaoProduto,
      percentualComissaoServico,
    });
    this.id = id;
    this.nomeCompleto = nomeCompleto.trim();
    this.cpf = normalizarCpf(cpf);
    this.endereco = endereco?.trim() ?? null;
    this.telefone = telefone?.trim() ?? null;
    this.profissoes = profissoes.map((p) => p.trim()).filter((p) => p.length > 0);
    this.email = email.trim().toLowerCase();
    this.senhaHash = senhaHash;
    this.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    this.dataAdmissao = dataAdmissao ? new Date(dataAdmissao) : null;
    this.nivelPermissao = nivelPermissao;
    this.status = status;
    this.percentualComissaoProduto = Number(percentualComissaoProduto) || 0;
    this.percentualComissaoServico = Number(percentualComissaoServico) || 0;
  }

  static validar({
    nomeCompleto,
    cpf,
    profissoes,
    email,
    nivelPermissao,
    status,
    percentualComissaoProduto = 0,
    percentualComissaoServico = 0,
  }) {
    const erros = [];
    if (!nomeCompleto || nomeCompleto.trim().length < 2) erros.push('nomeCompleto eh obrigatorio.');
    const cpfNormalizado = normalizarCpf(cpf);
    if (cpfNormalizado !== null && cpfNormalizado.length !== 11) {
      erros.push('cpf deve conter 11 digitos.');
    }
    if (!Array.isArray(profissoes) || profissoes.filter((p) => p && p.trim().length >= 2).length === 0) {
      erros.push('profissoes deve conter pelo menos uma profissao valida.');
    }
    if (!email || !EMAIL_REGEX.test(email)) erros.push('email invalido.');
    if (!percentualValido(percentualComissaoProduto)) {
      erros.push('percentualComissaoProduto deve ser um numero entre 0 e 100.');
    }
    if (!percentualValido(percentualComissaoServico)) {
      erros.push('percentualComissaoServico deve ser um numero entre 0 e 100.');
    }
    if (erros.length > 0) throw new ValidationError('Funcionario invalido.', erros);
    validarNivelPermissao(nivelPermissao);
    validarStatus(status);
  }

  estaAtivo() {
    return this.status === Status.ATIVO;
  }
}
