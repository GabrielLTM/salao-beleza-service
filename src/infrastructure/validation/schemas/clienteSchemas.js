import { z } from 'zod';
import { dataNascimentoSchema } from './comuns.js';

const camposComuns = {
  nomeCompleto: z.string().min(2),
  whatsApp: z.string().min(8),
  dataNascimento: dataNascimentoSchema,
  endereco: z.string().nullable().optional(),
};

export const cadastrarClienteSchema = z.object(camposComuns);
export const editarClienteSchema = z.object(camposComuns);
