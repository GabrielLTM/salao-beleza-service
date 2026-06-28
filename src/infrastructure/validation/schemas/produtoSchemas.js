import { z } from 'zod';

const campos = {
  nome: z.string().min(1),
  valor: z.number().nonnegative('valor deve ser >= 0.'),
  caminhoImagem: z.string().nullable().optional(),
  status: z.number().int().min(0).max(1),
  percentualComissao: z
    .number()
    .min(0, 'percentualComissao deve ser >= 0.')
    .max(100, 'percentualComissao deve ser <= 100.')
    .optional()
    .default(0),
};

export const cadastrarProdutoSchema = z.object(campos);
export const editarProdutoSchema = z.object(campos);
