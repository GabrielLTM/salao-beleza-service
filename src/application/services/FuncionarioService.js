import { Funcionario } from '../../domain/entities/Funcionario.js';
import { ConflictError } from '../../domain/errors/ConflictError.js';
import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../domain/errors/ValidationError.js';
import { FuncionarioMapper } from '../mappers/FuncionarioMapper.js';

/**
 * Service de Funcionarios.
 * Concentra todas as operacoes do recurso (listar, buscar, criar, editar, excluir).
 */
export class FuncionarioService {
  /** @param {{ funcionarioRepository:any, hasher:any }} deps */
  constructor({ funcionarioRepository, hasher }) {
    this.funcionarioRepository = funcionarioRepository;
    this.hasher = hasher;
  }

  async listar({ pagina, tamanho }) {
    const { itens, total } = await this.funcionarioRepository.listar({ pagina, tamanho });
    return { itens: itens.map(FuncionarioMapper.paraDto), pagina, tamanho, total };
  }

  async buscarPorId(id) {
    const f = await this.funcionarioRepository.buscarPorId(id);
    if (!f) throw new NotFoundError('Funcionario nao encontrado.');
    return FuncionarioMapper.paraDto(f);
  }

  async criar(entrada) {
    if (!entrada?.senha || String(entrada.senha).length < 6) {
      throw new ValidationError('Senha invalida.', ['senha deve ter pelo menos 6 caracteres.']);
    }
    const existente = await this.funcionarioRepository.buscarPorEmail(
      String(entrada.email).trim().toLowerCase(),
    );
    if (existente) throw new ConflictError('Ja existe funcionario com este email.');

    const senhaHash = await this.hasher.hash(entrada.senha);
    const funcionario = new Funcionario({ ...entrada, senhaHash });

    if (funcionario.cpf) {
      const cpfExistente = await this.funcionarioRepository.buscarPorCpf(funcionario.cpf);
      if (cpfExistente) throw new ConflictError('Ja existe funcionario com este cpf.');
    }

    const salvo = await this.funcionarioRepository.criar({
      id: funcionario.id,
      nomeCompleto: funcionario.nomeCompleto,
      cpf: funcionario.cpf,
      endereco: funcionario.endereco,
      telefone: funcionario.telefone,
      celular: funcionario.celular,
      profissoes: funcionario.profissoes,
      email: funcionario.email,
      senhaHash: funcionario.senhaHash,
      dataNascimento: funcionario.dataNascimento,
      dataAdmissao: funcionario.dataAdmissao,
      nivelPermissao: funcionario.nivelPermissao,
      status: funcionario.status,
    });
    return FuncionarioMapper.paraDto(salvo);
  }

  async editar(id, entrada) {
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

    if (funcionario.cpf && funcionario.cpf !== atual.cpf) {
      const cpfDuplicado = await this.funcionarioRepository.buscarPorCpf(funcionario.cpf);
      if (cpfDuplicado && cpfDuplicado.id !== id) {
        throw new ConflictError('Ja existe outro funcionario com este cpf.');
      }
    }

    const salvo = await this.funcionarioRepository.atualizar({
      id: funcionario.id,
      nomeCompleto: funcionario.nomeCompleto,
      cpf: funcionario.cpf,
      endereco: funcionario.endereco,
      telefone: funcionario.telefone,
      celular: funcionario.celular,
      profissoes: funcionario.profissoes,
      email: funcionario.email,
      senhaHash: funcionario.senhaHash,
      dataNascimento: funcionario.dataNascimento,
      dataAdmissao: funcionario.dataAdmissao,
      nivelPermissao: funcionario.nivelPermissao,
      status: funcionario.status,
    });
    return FuncionarioMapper.paraDto(salvo);
  }

  async excluir(id) {
    const atual = await this.funcionarioRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Funcionario nao encontrado.');
    await this.funcionarioRepository.excluir(id);
  }
}
