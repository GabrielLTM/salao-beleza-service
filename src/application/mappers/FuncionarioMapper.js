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
      cpf: f.cpf ?? null,
      endereco: f.endereco ?? null,
      telefone: f.telefone ?? null,
      profissoes: f.profissoes ?? [],
      email: f.email,
      dataNascimento: f.dataNascimento ? new Date(f.dataNascimento).toISOString() : null,
      dataAdmissao: f.dataAdmissao ? new Date(f.dataAdmissao).toISOString() : null,
      nivelPermissao: f.nivelPermissao,
      status: f.status,
      percentualComissaoProduto: f.percentualComissaoProduto ?? 0,
      percentualComissaoServico: f.percentualComissaoServico ?? 0,
    };
  },
};
