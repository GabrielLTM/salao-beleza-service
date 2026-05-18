import { JanelaAgenda } from '../../../domain/entities/AgendaFuncionario.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { AgendaMapper } from '../../mappers/AgendaMapper.js';

/**
 * Substitui o conjunto de janelas de agenda de um funcionario.
 */
export class DefinirAgendaFuncionario {
  constructor({ agendaRepository, funcionarioRepository }) {
    this.agendaRepository = agendaRepository;
    this.funcionarioRepository = funcionarioRepository;
  }

  /**
   * @param {string} funcionarioId
   * @param {{diaSemana:number, horaInicio:string, horaFim:string}[]} janelas
   */
  async executar(funcionarioId, janelas) {
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
}
