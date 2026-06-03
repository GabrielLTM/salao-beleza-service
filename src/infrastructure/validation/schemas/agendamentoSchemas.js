import { z } from 'zod';

export const cadastrarAgendamentoSchema = z.object({
  clienteId: z.string().min(1),
  funcionarioId: z.string().min(1),
  servicoIds: z.array(z.string().min(1)).min(1, 'Informe pelo menos um servico.'),
  dataHoraInicio: z.string().datetime({ offset: true }),
});

export const editarAgendamentoSchema = z.object({
  clienteId: z.string().min(1),
  funcionarioId: z.string().min(1),
  servicoIds: z.array(z.string().min(1)).min(1, 'Informe pelo menos um servico.'),
  dataHoraInicio: z.string().datetime({ offset: true }),
  status: z.enum(['AGENDADO', 'CONCLUIDO', 'CANCELADO']).optional(),
});
