export const ClienteMapper = {
  paraDto(c) {
    if (!c) return null;
    return {
      id: c.id,
      nomeCompleto: c.nomeCompleto,
      whatsApp: c.whatsApp,
      profissao: c.profissao ?? [],
      email: c.email ?? null,
      instagram: c.instagram ?? null,
      facebook: c.facebook ?? null,
      dataNascimento: c.dataNascimento ? new Date(c.dataNascimento).toISOString() : null,
      endereco: c.endereco ?? null,
    };
  },
};
