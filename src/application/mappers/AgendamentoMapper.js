export const AgendamentoMapper = {
  paraDto(a) {
    if (!a) return null;
    return {
      id: a.id,
      clienteId: a.clienteId,
      funcionarioId: a.funcionarioId,
      servicoId: a.servicoId,
      dataHoraInicio: a.dataHoraInicio instanceof Date ? a.dataHoraInicio.toISOString() : a.dataHoraInicio,
      dataHoraFim: a.dataHoraFim instanceof Date ? a.dataHoraFim.toISOString() : a.dataHoraFim,
      status: a.status,
    };
  },
};
