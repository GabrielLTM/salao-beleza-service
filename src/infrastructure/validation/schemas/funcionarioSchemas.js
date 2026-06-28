import { z } from 'zod';
import { dataNascimentoSchema, dataOpcionalSchema, dataPassadaSchema } from './comuns.js';

// Regex genérico para validar apenas letras e espaços (permite acentos)
const apenasLetrasRegex = /^[A-Za-zÀ-ÿ\s]+$/;

// Schema customizado para telefone
const telefoneSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === '' || (/^\d{10,11}$/.test(val) && !/^0+$/.test(val)),
    'Deve conter 10 ou 11 dígitos numéricos e não pode ser apenas zeros.'
  )
  .transform((val) => (val === '' ? null : val))
  .nullable()
  .optional();

const camposComuns = {
  nomeCompleto: z
    .string()
    .trim()
    .min(2, 'nomeCompleto deve ter pelo menos 2 caracteres.')
    .regex(apenasLetrasRegex, 'nomeCompleto não pode conter números ou símbolos.')
    .refine(
      (val) => val.split(' ').filter(Boolean).length >= 2,
      'nomeCompleto deve conter nome e sobrenome.'
    ),
  
  cpf: z
    .string()
    .trim()
    .regex(/^\d{11}$/, 'cpf deve conter 11 digitos (apenas numeros).')
    .nullable()
    .optional(),
    
  endereco: z.string().trim().nullable().optional(),
  
  telefone: telefoneSchema,

  profissoes: z
    .array(
      z
        .string()
        .trim()
        .min(2, 'cada profissao deve ter pelo menos 2 caracteres.')
        .regex(/^[A-Za-zÀ-ÿ\s\,\-]+$/, 'A profissão não pode conter números ou símbolos inválidos.')
    )
    .min(1, 'profissoes deve conter pelo menos uma profissao.'),
    
  email: z.string().trim().email('email invalido.'),
  
  // Aqui aplicamos as travas de datas!
  dataNascimento: dataNascimentoSchema,
  dataAdmissao: dataPassadaSchema,
  
  nivelPermissao: z.number().int().min(1).max(4),
  status: z.number().int().min(0).max(1),

  percentualComissaoProduto: z
    .number()
    .min(0, 'percentualComissaoProduto deve ser >= 0.')
    .max(100, 'percentualComissaoProduto deve ser <= 100.')
    .optional()
    .default(0),
  percentualComissaoServico: z
    .number()
    .min(0, 'percentualComissaoServico deve ser >= 0.')
    .max(100, 'percentualComissaoServico deve ser <= 100.')
    .optional()
    .default(0),
};

export const cadastrarFuncionarioSchema = z.object({
  ...camposComuns,
  senha: z.string().min(6, 'senha deve ter pelo menos 6 caracteres.'),
});

export const editarFuncionarioSchema = z.object({
  ...camposComuns,
  senha: z.string().min(6).optional(),
});