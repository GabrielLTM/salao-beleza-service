/**
 * Contrato de repositorio para Funcionario.
 * Implementacoes concretas (Prisma, in-memory) devem honrar todos os metodos.
 *
 * @typedef {object} FuncionarioRegistro
 * @property {string} id
 * @property {string} nomeCompleto
 * @property {string|null} cpf
 * @property {string|null} endereco
 * @property {string|null} telefone
 * @property {string[]} profissoes
 * @property {string} email
 * @property {string} senhaHash
 * @property {Date|null} dataNascimento
 * @property {Date|null} dataAdmissao
 * @property {number} nivelPermissao
 * @property {number} status
 * @property {number} percentualComissaoProduto
 * @property {number} percentualComissaoServico
 *
 * @typedef {object} ListagemArgs
 * @property {number} pagina
 * @property {number} tamanho
 *
 * @typedef {object} ListagemResultado
 * @property {FuncionarioRegistro[]} itens
 * @property {number} total
 */

/* eslint-disable no-unused-vars */
export class IFuncionarioRepository {
  /** @param {ListagemArgs} _args @returns {Promise<ListagemResultado>} */
  async listar(_args) { throw new Error('Nao implementado'); }
  /** @param {string} _id @returns {Promise<FuncionarioRegistro|null>} */
  async buscarPorId(_id) { throw new Error('Nao implementado'); }
  /** @param {string} _email @returns {Promise<FuncionarioRegistro|null>} */
  async buscarPorEmail(_email) { throw new Error('Nao implementado'); }
  /** @param {string} _cpf @returns {Promise<FuncionarioRegistro|null>} */
  async buscarPorCpf(_cpf) { throw new Error('Nao implementado'); }
  /** @param {FuncionarioRegistro} _registro @returns {Promise<FuncionarioRegistro>} */
  async criar(_registro) { throw new Error('Nao implementado'); }
  /** @param {FuncionarioRegistro} _registro @returns {Promise<FuncionarioRegistro>} */
  async atualizar(_registro) { throw new Error('Nao implementado'); }
  /** @param {string} _id @returns {Promise<void>} */
  async excluir(_id) { throw new Error('Nao implementado'); }
}
