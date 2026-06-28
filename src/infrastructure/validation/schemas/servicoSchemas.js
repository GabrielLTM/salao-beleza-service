import { z } from 'zod';

const campos = {
  nome: z.string().min(2),
  duracaoMinutos: z.number().int().positive('duracaoMinutos deve ser > 0.'),
  precoMinimo: z.number().nonnegative('precoMinimo deve ser >= 0.'),
  categoriaId: z.string().min(1, 'categoriaId eh obrigatorio.'),
  status: z.number().int().min(0).max(1),
  percentualComissao: z
    .number()
    .min(0, 'percentualComissao deve ser >= 0.')
    .max(100, 'percentualComissao deve ser <= 100.')
    .optional()
    .default(0),
};

export const cadastrarServicoSchema = z.object(campos);
export const editarServicoSchema = z.object(campos);
