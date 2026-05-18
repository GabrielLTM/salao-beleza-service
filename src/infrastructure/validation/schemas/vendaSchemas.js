import { z } from 'zod';

const itemSchema = z
  .object({
    tipo: z.enum(['PRODUTO', 'SERVICO']),
    produtoId: z.string().min(1).nullable().optional(),
    servicoId: z.string().min(1).nullable().optional(),
    quantidade: z.number().int().positive(),
    valorUnitario: z.number().nonnegative(),
  })
  .superRefine((v, ctx) => {
    if (v.tipo === 'PRODUTO' && !v.produtoId) {
      ctx.addIssue({ code: 'custom', path: ['produtoId'], message: 'produtoId obrigatorio para tipo PRODUTO.' });
    }
    if (v.tipo === 'SERVICO' && !v.servicoId) {
      ctx.addIssue({ code: 'custom', path: ['servicoId'], message: 'servicoId obrigatorio para tipo SERVICO.' });
    }
  });

export const registrarVendaSchema = z.object({
  funcionarioId: z.string().min(1),
  clienteId: z.string().min(1).nullable().optional(),
  dataHora: z.string().datetime({ offset: true }).optional(),
  itens: z.array(itemSchema).min(1, 'A venda deve ter pelo menos 1 item.'),
});

export const listarVendasQuerySchema = z.object({
  pagina: z.string().optional(),
  tamanho: z.string().optional(),
  funcionarioId: z.string().min(1).optional(),
  clienteId: z.string().min(1).optional(),
});
