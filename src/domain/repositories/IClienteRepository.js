/**
 * @typedef {object} ClienteRegistro
 * @property {string} id
 * @property {string} nomeCompleto
 * @property {string} whatsApp
 * @property {Date|null} dataNascimento
 * @property {string|null} endereco
 */

/* eslint-disable no-unused-vars */
export class IClienteRepository {
  async listar(_args) { throw new Error('Nao implementado'); }
  async buscarPorId(_id) { throw new Error('Nao implementado'); }
  async criar(_registro) { throw new Error('Nao implementado'); }
  async atualizar(_registro) { throw new Error('Nao implementado'); }
  async excluir(_id) { throw new Error('Nao implementado'); }
}
