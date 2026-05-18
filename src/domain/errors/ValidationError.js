import { DomainError } from './DomainError.js';

export class ValidationError extends DomainError {
  constructor(mensagem = 'Dados invalidos.', erros = []) {
    super(mensagem, erros);
    this.name = 'ValidationError';
    this.statusHttp = 422;
  }
}
