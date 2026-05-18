import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';

export class Categoria {
  constructor({ id = randomUUID(), nome }) {
    if (!nome || nome.trim().length < 2) {
      throw new ValidationError('Categoria invalida.', ['nome eh obrigatorio.']);
    }
    this.id = id;
    this.nome = nome.trim();
  }
}
