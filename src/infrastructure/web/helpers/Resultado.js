/**
 * Envelope padronizado de resposta esperado pelo front-end.
 *   { sucesso: boolean, mensagem: string, erros: string[], dados: any }
 */
export class Resultado {
  /** @param {{sucesso:boolean, mensagem?:string, erros?:string[], dados?:*}} args */
  constructor({ sucesso, mensagem = '', erros = [], dados = null }) {
    this.sucesso = sucesso;
    this.mensagem = mensagem;
    this.erros = erros;
    this.dados = dados;
  }

  static ok(dados, mensagem = 'Operacao realizada com sucesso.') {
    return new Resultado({ sucesso: true, mensagem, erros: [], dados });
  }

  static falha(mensagem, erros = [], dados = null) {
    return new Resultado({ sucesso: false, mensagem, erros, dados });
  }
}
