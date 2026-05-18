import { z } from 'zod';

export const cadastrarCategoriaSchema = z.object({
  nome: z.string().min(2),
  servicoIds: z.array(z.string().min(1)).optional().default([]),
});

export const editarCategoriaSchema = z.object({
  nome: z.string().min(2),
  servicoIds: z.array(z.string().min(1)).optional().default([]),
});
