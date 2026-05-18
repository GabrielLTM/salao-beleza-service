import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('email invalido.'),
  senha: z.string().min(1, 'senha eh obrigatoria.'),
});
