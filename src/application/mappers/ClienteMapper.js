export const ClienteMapper = {
  paraDto(c) {
    if (!c) return null;
    return {
      id: c.id,
      nomeCompleto: c.nomeCompleto,
      whatsApp: c.whatsApp,
      dataNascimento: c.dataNascimento ? new Date(c.dataNascimento).toISOString() : null,
      endereco: c.endereco ?? null,
    };
  },
};
