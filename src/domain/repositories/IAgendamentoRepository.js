/**
 * @typedef {object} AgendamentoRegistro
 * @property {string} id
 * @property {string} clienteId
 * @property {string} funcionarioId
 * @property {string} servicoId
 * @property {Date} dataHoraInicio
 * @property {Date} dataHoraFim
 * @property {'AGENDADO'|'CONCLUIDO'|'CANCELADO'} status
 */

/* eslint-disable no-unused-vars */
export class IAgendamentoRepository {
  async listar(_args) { throw new Error('Nao implementado'); }
  async buscarPorId(_id) { throw new Error('Nao implementado'); }
  async criar(_registro) { throw new Error('Nao implementado'); }
  async atualizar(_registro) { throw new Error('Nao implementado'); }
  async cancelar(_id) { throw new Error('Nao implementado'); }
  async excluir(_id) { throw new Error('Nao implementado'); }
  /**
   * Busca agendamentos ATIVOS (status != CANCELADO) do funcionario que se sobrepoem
   * ao intervalo informado. Opcionalmente exclui um id (uso em edicao).
   */
  async buscarConflitos(_funcionarioId, _inicio, _fim, _excluirId) { throw new Error('Nao implementado'); }
  async contarPorFuncionarioConcluidos(_funcionarioId, _inicio, _fim) { throw new Error('Nao implementado'); }
}
