import { Funcionario } from '../../../domain/entities/Funcionario.js';
import { ConflictError } from '../../../domain/errors/ConflictError.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { FuncionarioMapper } from '../../mappers/FuncionarioMapper.js';

export class EditarFuncionario {
  /** @param {{ funcionarioRepository:any, hasher:any }} deps */
  constructor({ funcionarioRepository, hasher }) {
    this.funcionarioRepository = funcionarioRepository;
    this.hasher = hasher;
  }

  /**
   * @param {string} id
   * @param {object} entrada Campos do FuncionarioEdicaoDto. `senha` opcional - quando enviada, regera o hash.
   */
  async executar(id, entrada) {
    const atual = await this.funcionarioRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Funcionario nao encontrado.');

    const emailNovo = String(entrada.email).trim().toLowerCase();
    if (emailNovo !== atual.email) {
      const duplicado = await this.funcionarioRepository.buscarPorEmail(emailNovo);
      if (duplicado && duplicado.id !== id) {
        throw new ConflictError('Ja existe outro funcionario com este email.');
      }
    }

    const senhaHash = entrada.senha ? await this.hasher.hash(entrada.senha) : atual.senhaHash;
    const funcionario = new Funcionario({ ...entrada, id, senhaHash });

    const salvo = await this.funcionarioRepository.atualizar({
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
