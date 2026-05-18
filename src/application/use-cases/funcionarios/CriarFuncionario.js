import { Funcionario } from '../../../domain/entities/Funcionario.js';
import { ConflictError } from '../../../domain/errors/ConflictError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { FuncionarioMapper } from '../../mappers/FuncionarioMapper.js';

export class CriarFuncionario {
  /** @param {{ funcionarioRepository:any, hasher:any }} deps */
  constructor({ funcionarioRepository, hasher }) {
    this.funcionarioRepository = funcionarioRepository;
    this.hasher = hasher;
  }

  /**
   * @param {object} entrada Os campos do FuncionarioCadastroDto + `senha` (obrigatoria na criacao).
   */
  async executar(entrada) {
    if (!entrada?.senha || String(entrada.senha).length < 6) {
      throw new ValidationError('Senha invalida.', ['senha deve ter pelo menos 6 caracteres.']);
    }
    const existente = await this.funcionarioRepository.buscarPorEmail(
      String(entrada.email).trim().toLowerCase(),
    );
    if (existente) throw new ConflictError('Ja existe funcionario com este email.');

    const senhaHash = await this.hasher.hash(entrada.senha);
    const funcionario = new Funcionario({ ...entrada, senhaHash });
    const salvo = await this.funcionarioRepository.criar({
      id: funcionario.id,
      nomeCompleto: funcionario.nomeCompleto,
      endereco: funcionario.endereco,
      telefone: funcionario.telefone,
      profissaoCargo: funcionario.profissaoCargo,
      email: funcionario.email,
      senhaHash: funcionario.senhaHash,
      dataNascimento: funcionario.dataNascimento,
      nivelPermissao: funcionario.nivelPermissao,
      status: funcionario.status,
    });
    return FuncionarioMapper.paraDto(salvo);
  }
}
