import { DomainError } from '../../../domain/errors/DomainError.js';
import { Resultado } from '../helpers/Resultado.js';

export function tratadorDeErros(err, _req, res, _next) {
  if (err instanceof DomainError) {
    return res.status(err.statusHttp ?? 400).json(
      Resultado.falha(err.message, err.erros ?? []),
    );
  }
  console.error('[erro nao tratado]', err);
  return res.status(500).json(
    Resultado.falha('Erro interno do servidor.', [err.message ?? 'desconhecido']),
  );
}
