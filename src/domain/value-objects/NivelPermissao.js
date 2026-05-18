import { ValidationError } from '../errors/ValidationError.js';

export const NivelPermissao = Object.freeze({
  RECEPCAO: 1,
  PROFISSIONAL: 2,
  GERENTE: 3,
  ADMINISTRADOR: 4,
});

const valoresValidos = new Set(Object.values(NivelPermissao));

export function validarNivelPermissao(valor) {
  if (!valoresValidos.has(valor)) {
    throw new ValidationError('nivelPermissao invalido.', [
      `nivelPermissao deve ser um entre: ${[...valoresValidos].join(', ')}`,
    ]);
  }
  return valor;
}
