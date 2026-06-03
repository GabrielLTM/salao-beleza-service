import { z } from 'zod';

export const guidSchema = z.string().min(1, 'id eh obrigatorio.');

export const paramIdSchema = z.object({ id: guidSchema });

export const dataOpcionalSchema = z
  .union([z.string().datetime({ offset: true }), z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.null()])
  .optional()
  .nullable();

export const dataNascimentoSchema = dataOpcionalSchema;
