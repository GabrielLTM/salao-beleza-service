/**
 * @typedef {object} ServicoRegistro
 * @property {string} id
 * @property {string} nome
 * @property {number} duracaoMinutos
 * @property {number} precoMinimo
 * @property {string} categoriaId
 * @property {string} [nomeCategoria]
 * @property {number} status
 */

/* eslint-disable no-unused-vars */
export class IServicoRepository {
  async listarComCategoria(_args) { throw new Error('Nao implementado'); }
  async buscarPorIdComCategoria(_id) { throw new Error('Nao implementado'); }
  async buscarPorId(_id) { throw new Error('Nao implementado'); }
  async buscarVariosPorIds(_ids) { throw new Error('Nao implementado'); }
  async criar(_registro) { throw new Error('Nao implementado'); }
  async atualizar(_registro) { throw new Error('Nao implementado'); }
  async excluir(_id) { throw new Error('Nao implementado'); }
  async definirCategoriaParaIds(_ids, _categoriaId) { throw new Error('Nao implementado'); }
}
