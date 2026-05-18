import { ValidationError } from '../../../domain/errors/ValidationError.js';

/**
 * Middleware que valida `req.body` contra um schema Zod.
 * Em caso de falha, lanca ValidationError (capturado pelo tratadorDeErros).
 */
export function validarBody(schema) {
  return (req, _res, next) => {
    const r = schema.safeParse(req.body);
    if (!r.success) {
      const erros = r.error.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`);
      return next(new ValidationError('Corpo da requisicao invalido.', erros));
    }
    req.body = r.data;
    next();
  };
}

export function validarParams(schema) {
  return (req, _res, next) => {
    const r = schema.safeParse(req.params);
    if (!r.success) {
      const erros = r.error.issues.map((i) => `${i.path.join('.') || 'params'}: ${i.message}`);
      return next(new ValidationError('Parametros invalidos.', erros));
    }
    req.params = r.data;
    next();
  };
}

export function validarQuery(schema) {
  return (req, _res, next) => {
    const r = schema.safeParse(req.query);
    if (!r.success) {
      const erros = r.error.issues.map((i) => `${i.path.join('.') || 'query'}: ${i.message}`);
      return next(new ValidationError('Query invalida.', erros));
    }
    req.query = r.data;
    next();
  };
}
