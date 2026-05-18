import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError.js';
import { Status } from '../../../domain/value-objects/Status.js';

/**
 * Caso de uso: autentica um funcionario por email/senha e retorna um JWT.
 */
export class LoginFuncionario {
  /**
   * @param {{ funcionarioRepository:any, hasher:any, tokenService:any }} deps
   */
  constructor({ funcionarioRepository, hasher, tokenService }) {
    this.funcionarioRepository = funcionarioRepository;
    this.hasher = hasher;
    this.tokenService = tokenService;
  }

  async executar({ email, senha }) {
    if (!email || !senha) {
      throw new UnauthorizedError('Email e senha sao obrigatorios.');
    }
    const f = await this.funcionarioRepository.buscarPorEmail(String(email).trim().toLowerCase());
    if (!f) throw new UnauthorizedError('Credenciais invalidas.');
    if (f.status !== Status.ATIVO) throw new UnauthorizedError('Funcionario inativo.');

    const senhaOk = await this.hasher.comparar(senha, f.senhaHash);
    if (!senhaOk) throw new UnauthorizedError('Credenciais invalidas.');

    const token = this.tokenService.gerar({ id: f.id, nivelPermissao: f.nivelPermissao });
    return {
      token,
      funcionario: {
        id: f.id,
        nomeCompleto: f.nomeCompleto,
        email: f.email,
        nivelPermissao: f.nivelPermissao,
      },
    };
  }
}
