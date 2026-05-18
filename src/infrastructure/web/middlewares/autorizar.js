import { ForbiddenError } from '../../../domain/errors/UnauthorizedError.js';

/**
 * Exige nivelPermissao >= nivelMinimo.
 * Depende de `req.auth` ter sido populado pelo middleware autenticar.
 */
export function autorizar(nivelMinimo) {
  return function (req, _res, next) {
    const nivel = req.auth?.nivelPermissao;
    if (!Number.isInteger(nivel) || nivel < nivelMinimo) {
      return next(new ForbiddenError());
    }
    return next();
  };
}
