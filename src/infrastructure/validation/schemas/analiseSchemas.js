import { z } from 'zod';

export const periodoQuerySchema = z.object({
  inicio: z.string().datetime({ offset: true }),
  fim: z.string().datetime({ offset: true }),
  limite: z.string().optional(),
});
