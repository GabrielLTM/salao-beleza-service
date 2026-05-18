import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';
import { validarStatus } from '../value-objects/Status.js';

export class Servico {
  constructor({ id = randomUUID(), nome, duracaoMinutos, precoMinimo, categoriaId, status }) {
    Servico.validar({ nome, duracaoMinutos, precoMinimo, categoriaId, status });
    this.id = id;
    this.nome = nome.trim();
    this.duracaoMinutos = Number(duracaoMinutos);
    this.precoMinimo = Number(precoMinimo);
    this.categoriaId = categoriaId;
    this.status = status;
  }

  static validar({ nome, duracaoMinutos, precoMinimo, categoriaId, status }) {
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
    if (erros.length > 0) throw new ValidationError('Servico invalido.', erros);
    validarStatus(status);
  }
}
