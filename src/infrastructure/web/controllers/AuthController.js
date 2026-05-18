import { Resultado } from '../helpers/Resultado.js';

export class AuthController {
  /** @param {{ authService: import('../../../application/services/AuthService.js').AuthService }} deps */
  constructor({ authService }) {
    this.authService = authService;
  }

  login = async (req, res, next) => {
    try {
      const dados = await this.authService.login(req.body);
      return res.status(200).json(Resultado.ok(dados, 'Autenticado com sucesso.'));
    } catch (e) {
      return next(e);
    }
  };
}
