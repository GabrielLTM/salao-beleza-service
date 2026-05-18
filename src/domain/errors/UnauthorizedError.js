import { DomainError } from './DomainError.js';

export class UnauthorizedError extends DomainError {
  constructor(mensagem = 'Credenciais invalidas ou token expirado.') {
    super(mensagem, []);
    this.name = 'UnauthorizedError';
    this.statusHttp = 401;
  }
}

export class ForbiddenError extends DomainError {
  constructor(mensagem = 'Acesso negado para o nivel de permissao atual.') {
    super(mensagem, []);
    this.name = 'ForbiddenError';
    this.statusHttp = 403;
  }
}
