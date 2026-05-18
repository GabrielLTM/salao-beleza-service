import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';
import { validarStatus } from '../value-objects/Status.js';

export class Produto {
  constructor({ id = randomUUID(), nome, valor, caminhoImagem = null, status }) {
    Produto.validar({ nome, valor, status });
    this.id = id;
    this.nome = nome.trim();
    this.valor = Number(valor);
    this.caminhoImagem = caminhoImagem?.trim() ?? null;
    this.status = status;
  }

  static validar({ nome, valor, status }) {
    const erros = [];
    if (!nome || nome.trim().length < 1) erros.push('nome eh obrigatorio.');
    if (valor === null || valor === undefined || Number.isNaN(Number(valor)) || Number(valor) < 0) {
      erros.push('valor deve ser um numero >= 0.');
    }
    if (erros.length > 0) throw new ValidationError('Produto invalido.', erros);
    validarStatus(status);
  }
}
