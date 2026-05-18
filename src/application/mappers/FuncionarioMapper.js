/**
 * Mapeia o registro persistido (FuncionarioRegistro) para o DTO de leitura
 * exposto pela API (campos definidos em Regra geral.txt).
 */
export const FuncionarioMapper = {
  paraDto(f) {
    if (!f) return null;
    return {
      id: f.id,
      nomeCompleto: f.nomeCompleto,
      endereco: f.endereco ?? null,
      telefone: f.telefone ?? null,
      profissaoCargo: f.profissaoCargo,
      email: f.email,
      dataNascimento: f.dataNascimento ? new Date(f.dataNascimento).toISOString() : null,
      nivelPermissao: f.nivelPermissao,
      status: f.status,
    };
  },
};
