import { DomainError } from './DomainError.js';

export class ConflictError extends DomainError {
  constructor(mensagem = 'Conflito com o estado atual do recurso.', erros = []) {
    super(mensagem, erros);
    this.name = 'ConflictError';
    this.statusHttp = 409;
  }
}
