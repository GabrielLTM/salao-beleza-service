import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';
import { validarStatus } from '../value-objects/Status.js';
import { percentualValido } from '../value-objects/Percentual.js';

export class Produto {
  constructor({ id = randomUUID(), nome, valor, caminhoImagem = null, status, percentualComissao = 0 }) {
    Produto.validar({ nome, valor, status, percentualComissao });
    this.id = id;
    this.nome = nome.trim();
    this.valor = Number(valor);
    this.caminhoImagem = caminhoImagem?.trim() ?? null;
    this.status = status;
    this.percentualComissao = Number(percentualComissao) || 0;
  }

  static validar({ nome, valor, status, percentualComissao = 0 }) {
    const erros = [];
    if (!nome || nome.trim().length < 1) erros.push('nome eh obrigatorio.');
    if (valor === null || valor === undefined || Number.isNaN(Number(valor)) || Number(valor) < 0) {
      erros.push('valor deve ser um numero >= 0.');
    }
    if (!percentualValido(percentualComissao)) {
      erros.push('percentualComissao deve ser um numero entre 0 e 100.');
    }
    if (erros.length > 0) throw new ValidationError('Produto invalido.', erros);
    validarStatus(status);
  }
}
