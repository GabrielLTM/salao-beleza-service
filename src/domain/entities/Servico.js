import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';
import { validarStatus } from '../value-objects/Status.js';
import { percentualValido } from '../value-objects/Percentual.js';

export class Servico {
  constructor({ id = randomUUID(), nome, duracaoMinutos, precoMinimo, categoriaId, status, percentualComissao = 0 }) {
    Servico.validar({ nome, duracaoMinutos, precoMinimo, categoriaId, status, percentualComissao });
    this.id = id;
    this.nome = nome.trim();
    this.duracaoMinutos = Number(duracaoMinutos);
    this.precoMinimo = Number(precoMinimo);
    this.categoriaId = categoriaId;
    this.status = status;
    this.percentualComissao = Number(percentualComissao) || 0;
  }

  static validar({ nome, duracaoMinutos, precoMinimo, categoriaId, status, percentualComissao = 0 }) {
    const erros = [];
    if (!nome || nome.trim().length < 2) erros.push('nome eh obrigatorio.');
    if (!Number.isFinite(Number(duracaoMinutos)) || Number(duracaoMinutos) <= 0) {
      erros.push('duracaoMinutos deve ser um inteiro > 0.');
    }
    if (precoMinimo === null || precoMinimo === undefined || Number.isNaN(Number(precoMinimo)) || Number(precoMinimo) < 0) {
      erros.push('precoMinimo deve ser um numero >= 0.');
    }
    if (!categoriaId || typeof categoriaId !== 'string') {
      erros.push('categoriaId eh obrigatorio.');
    }
    if (!percentualValido(percentualComissao)) {
      erros.push('percentualComissao deve ser um numero entre 0 e 100.');
    }
    if (erros.length > 0) throw new ValidationError('Servico invalido.', erros);
    validarStatus(status);
  }
}
