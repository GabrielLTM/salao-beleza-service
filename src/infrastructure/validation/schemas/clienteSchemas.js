import { z } from 'zod';
import { dataNascimentoSchema } from './comuns.js';

const camposComuns = {
  nomeCompleto: z.string().min(2),
  whatsApp: z.string().min(8),
  profissao: z
    .array(z.string().min(1, 'cada profissao deve ter pelo menos 1 caractere.'))
    .optional(),
  email: z.string().email('email invalido.').nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  dataNascimento: dataNascimentoSchema,
  endereco: z.string().nullable().optional(),
};

export const cadastrarClienteSchema = z.object(camposComuns);
export const editarClienteSchema = z.object(camposComuns);
