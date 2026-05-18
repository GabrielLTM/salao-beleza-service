import { JanelaAgenda } from '../../domain/entities/AgendaFuncionario.js';
import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { AgendaMapper } from '../mappers/AgendaMapper.js';

export class AgendaService {
  constructor({ agendaRepository, funcionarioRepository }) {
    this.agendaRepository = agendaRepository;
    this.funcionarioRepository = funcionarioRepository;
  }

  async listarPorFuncionario(funcionarioId) {
    const f = await this.funcionarioRepository.buscarPorId(funcionarioId);
    if (!f) throw new NotFoundError('Funcionario nao encontrado.');
    const janelas = await this.agendaRepository.listarPorFuncionario(funcionarioId);
    return janelas.map(AgendaMapper.janelaParaDto);
  }

  /**
   * Substitui todas as janelas de agenda do funcionario.
   * @param {string} funcionarioId
   * @param {{diaSemana:number, horaInicio:string, horaFim:string}[]} janelas
   */
  async definirParaFuncionario(funcionarioId, janelas) {
    const f = await this.funcionarioRepository.buscarPorId(funcionarioId);
    if (!f) throw new NotFoundError('Funcionario nao encontrado.');

    const validadas = janelas.map((j) =>
      new JanelaAgenda({
        funcionarioId,
        diaSemana: j.diaSemana,
        horaInicio: j.horaInicio,
        horaFim: j.horaFim,
      }),
    );

    const salvas = await this.agendaRepository.definirJanelasParaFuncionario(
      funcionarioId,
      validadas.map((j) => ({
        id: j.id,
        funcionarioId: j.funcionarioId,
        diaSemana: j.diaSemana,
        horaInicio: j.horaInicio,
        horaFim: j.horaFim,
      })),
    );
    return salvas.map(AgendaMapper.janelaParaDto);
  }

  async removerJanela(id) {
    const j = await this.agendaRepository.buscarJanelaPorId(id);
    if (!j) throw new NotFoundError('Janela de agenda nao encontrada.');
    await this.agendaRepository.removerJanela(id);
  }
}
