import { Router } from 'express';
import { validarBody } from '../middlewares/validar.js';
import { loginSchema } from '../../validation/schemas/authSchemas.js';

/** @param {{ authController:any }} deps */
export function criarRotasAuth({ authController }) {
  const router = Router();
  router.post('/login', validarBody(loginSchema), authController.login);
  return router;
}
