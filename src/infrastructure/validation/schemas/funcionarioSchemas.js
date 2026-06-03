import { z } from 'zod';
import { dataNascimentoSchema, dataOpcionalSchema } from './comuns.js';

const camposComuns = {
  nomeCompleto: z.string().min(2, 'nomeCompleto deve ter pelo menos 2 caracteres.'),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'cpf deve conter 11 digitos (apenas numeros).')
    .nullable()
    .optional(),
  endereco: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  celular: z.string().nullable().optional(),
  profissoes: z
    .array(z.string().min(2, 'cada profissao deve ter pelo menos 2 caracteres.'))
    .min(1, 'profissoes deve conter pelo menos uma profissao.'),
  email: z.string().email('email invalido.'),
  dataNascimento: dataNascimentoSchema,
  dataAdmissao: dataOpcionalSchema,
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
