import { z } from 'zod';

const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const janelaSchema = z.object({
  diaSemana: z.number().int().min(0).max(6),
  horaInicio: z.string().regex(horaRegex, 'horaInicio invalida (HH:mm).'),
  horaFim: z.string().regex(horaRegex, 'horaFim invalida (HH:mm).'),
});

export const definirAgendaSchema = z.object({
  janelas: z.array(janelaSchema),
});

export { janelaSchema };
