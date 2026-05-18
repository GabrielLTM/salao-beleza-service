const PAGINA_PADRAO = 1;
const TAMANHO_PADRAO = 20;
const TAMANHO_MAX = 100;

export function paginacao(req, _res, next) {
  const pagina = Math.max(Number.parseInt(req.query.pagina, 10) || PAGINA_PADRAO, 1);
  let tamanho = Number.parseInt(req.query.tamanho, 10) || TAMANHO_PADRAO;
  tamanho = Math.min(Math.max(tamanho, 1), TAMANHO_MAX);
  req.paginacao = { pagina, tamanho };
  next();
}
