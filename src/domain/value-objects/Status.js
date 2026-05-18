import { ValidationError } from '../errors/ValidationError.js';

export const Status = Object.freeze({
  INATIVO: 0,
  ATIVO: 1,
});

export function validarStatus(valor) {
  if (valor !== Status.ATIVO && valor !== Status.INATIVO) {
    throw new ValidationError('status invalido.', ['status deve ser 0 (Inativo) ou 1 (Ativo)']);
  }
  return valor;
}
