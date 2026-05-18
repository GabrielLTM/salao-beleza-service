/**
 * @typedef {object} ProdutoRegistro
 * @property {string} id
 * @property {string} nome
 * @property {number} valor
 * @property {string|null} caminhoImagem
 * @property {number} status
 */

/* eslint-disable no-unused-vars */
export class IProdutoRepository {
  async listar(_args) { throw new Error('Nao implementado'); }
  async buscarPorId(_id) { throw new Error('Nao implementado'); }
  async buscarVariosPorIds(_ids) { throw new Error('Nao implementado'); }
  async criar(_registro) { throw new Error('Nao implementado'); }
  async atualizar(_registro) { throw new Error('Nao implementado'); }
  async excluir(_id) { throw new Error('Nao implementado'); }
}
