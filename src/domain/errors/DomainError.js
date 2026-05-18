export class DomainError extends Error {
  /**
   * @param {string} mensagem
   * @param {string[]} [erros]
   */
  constructor(mensagem, erros = []) {
    super(mensagem);
    this.name = 'DomainError';
    this.erros = erros;
    this.statusHttp = 400;
  }
}
