import { Resultado } from '../helpers/Resultado.js';

export class AuthController {
  /** @param {{ loginFuncionario: import('../../../application/use-cases/auth/LoginFuncionario.js').LoginFuncionario }} deps */
  constructor({ loginFuncionario }) {
    this.loginFuncionario = loginFuncionario;
  }

  login = async (req, res, next) => {
    try {
      const dados = await this.loginFuncionario.executar(req.body);
      return res.status(200).json(Resultado.ok(dados, 'Autenticado com sucesso.'));
    } catch (e) {
      return next(e);
    }
  };
}
