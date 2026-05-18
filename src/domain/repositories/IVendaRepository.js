/**
 * @typedef {object} ItemVendaRegistro
 * @property {string} [id]
 * @property {'PRODUTO'|'SERVICO'} tipo
 * @property {string|null} produtoId
 * @property {string|null} servicoId
 * @property {number} quantidade
 * @property {number} valorUnitario
 *
 * @typedef {object} VendaRegistro
 * @property {string} id
 * @property {Date} dataHora
 * @property {number} total
 * @property {string} funcionarioId
 * @property {string|null} clienteId
 * @property {ItemVendaRegistro[]} itens
 */

/* eslint-disable no-unused-vars */
export class IVendaRepository {
  async listar(_args) { throw new Error('Nao implementado'); }
  async buscarPorId(_id) { throw new Error('Nao implementado'); }
  async criar(_registro) { throw new Error('Nao implementado'); }
  async somarTotalNoPeriodo(_inicio, _fim) { throw new Error('Nao implementado'); }
  async faturamentoPorFuncionario(_inicio, _fim) { throw new Error('Nao implementado'); }
  async rankingServicosVendidos(_inicio, _fim, _limite) { throw new Error('Nao implementado'); }
}
