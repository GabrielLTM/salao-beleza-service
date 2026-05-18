import { z } from 'zod';
import { dataNascimentoSchema } from './comuns.js';

const camposComuns = {
  nomeCompleto: z.string().min(2, 'nomeCompleto deve ter pelo menos 2 caracteres.'),
  endereco: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  profissaoCargo: z.string().min(2, 'profissaoCargo eh obrigatorio.'),
  email: z.string().email('email invalido.'),
  dataNascimento: dataNascimentoSchema,
  nivelPermissao: z.number().int().min(1).max(4),
  status: z.number().int().min(0).max(1),
};

export const cadastrarFuncionarioSchema = z.object({
  ...camposComuns,
  senha: z.string().min(6, 'senha deve ter pelo menos 6 caracteres.'),
});

export const editarFuncionarioSchema = z.object({
  ...camposComuns,
  senha: z.string().min(6).optional(),
});
