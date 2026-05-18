export const AgendaMapper = {
  janelaParaDto(j) {
    if (!j) return null;
    return {
      id: j.id,
      funcionarioId: j.funcionarioId,
      diaSemana: j.diaSemana,
      horaInicio: j.horaInicio,
      horaFim: j.horaFim,
    };
  },
};
