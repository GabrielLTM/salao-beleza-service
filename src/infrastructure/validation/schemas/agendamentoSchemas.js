import { z } from 'zod';

export const cadastrarAgendamentoSchema = z.object({
  clienteId: z.string().min(1),
  funcionarioId: z.string().min(1),
  servicoId: z.string().min(1),
  dataHoraInicio: z.string().datetime({ offset: true }),
});

export const editarAgendamentoSchema = z.object({
  clienteId: z.string().min(1),
  funcionarioId: z.string().min(1),
  servicoId: z.string().min(1),
  dataHoraInicio: z.string().datetime({ offset: true }),
  status: z.enum(['AGENDADO', 'CONCLUIDO', 'CANCELADO']).optional(),
});
