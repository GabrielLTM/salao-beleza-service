import { DomainError } from './DomainError.js';

export class NotFoundError extends DomainError {
  constructor(mensagem = 'Recurso nao encontrado.') {
    super(mensagem, []);
    this.name = 'NotFoundError';
    this.statusHttp = 404;
  }
}
