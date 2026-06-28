/**
 * Percentual de comissao, expresso como numero de 0 a 100.
 * Usado tanto no percentual do item (produto/servico) quanto no percentual do funcionario.
 */
export function percentualValido(valor) {
  const n = Number(valor);
  return Number.isFinite(n) && n >= 0 && n <= 100;
}
