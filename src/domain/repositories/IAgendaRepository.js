/**
 * @typedef {object} JanelaAgendaRegistro
 * @property {string} id
 * @property {string} funcionarioId
 * @property {number} diaSemana
 * @property {string} horaInicio  // "HH:mm"
 * @property {string} horaFim     // "HH:mm"
 */

/* eslint-disable no-unused-vars */
export class IAgendaRepository {
  async listarPorFuncionario(_funcionarioId) { throw new Error('Nao implementado'); }
  async listarPorFuncionarioEDia(_funcionarioId, _diaSemana) { throw new Error('Nao implementado'); }
  async definirJanelasParaFuncionario(_funcionarioId, _janelas) { throw new Error('Nao implementado'); }
  async removerJanela(_id) { throw new Error('Nao implementado'); }
  async buscarJanelaPorId(_id) { throw new Error('Nao implementado'); }
}
