/**
 * @typedef {object} CategoriaRegistro
 * @property {string} id
 * @property {string} nome
 *
 * @typedef {object} CategoriaComServicos
 * @property {string} id
 * @property {string} nome
 * @property {{id:string, nome:string}[]} servicos
 */

/* eslint-disable no-unused-vars */
export class ICategoriaRepository {
  async listarComServicos(_args) { throw new Error('Nao implementado'); }
  async buscarPorIdComServicos(_id) { throw new Error('Nao implementado'); }
  async criar(_registro) { throw new Error('Nao implementado'); }
  async atualizar(_registro) { throw new Error('Nao implementado'); }
  async excluir(_id) { throw new Error('Nao implementado'); }
}
