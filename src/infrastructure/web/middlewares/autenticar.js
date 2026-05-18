import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError.js';

/**
 * Cria um middleware que valida o JWT do header Authorization.
 * @param {{ verificar:(t:string)=>any }} tokenService
 */
export function criarAutenticar(tokenService) {
  return function autenticar(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Token nao informado.'));
    }
    const token = header.slice('Bearer '.length).trim();
    try {
      const payload = tokenService.verificar(token);
      req.auth = { id: payload.id, nivelPermissao: payload.nivelPermissao };
      return next();
    } catch (e) {
      return next(e);
    }
  };
}
