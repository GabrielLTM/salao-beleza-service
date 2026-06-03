import { Cliente } from '../../domain/entities/Cliente.js';
import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { ClienteMapper } from '../mappers/ClienteMapper.js';

export class ClienteService {
  constructor({ clienteRepository }) {
    this.clienteRepository = clienteRepository;
  }

  async listar({ pagina, tamanho }) {
    const { itens, total } = await this.clienteRepository.listar({ pagina, tamanho });
    return { itens: itens.map(ClienteMapper.paraDto), pagina, tamanho, total };
  }

  async buscarPorId(id) {
    const c = await this.clienteRepository.buscarPorId(id);
    if (!c) throw new NotFoundError('Cliente nao encontrado.');
    return ClienteMapper.paraDto(c);
  }

  async criar(entrada) {
    const cliente = new Cliente(entrada);
    const salvo = await this.clienteRepository.criar({
      id: cliente.id,
      nomeCompleto: cliente.nomeCompleto,
      whatsApp: cliente.whatsApp,
      profissao: cliente.profissao,
      email: cliente.email,
      instagram: cliente.instagram,
      facebook: cliente.facebook,
      dataNascimento: cliente.dataNascimento,
      endereco: cliente.endereco,
    });
    return ClienteMapper.paraDto(salvo);
  }

  async editar(id, entrada) {
    const atual = await this.clienteRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Cliente nao encontrado.');
    const cliente = new Cliente({ ...entrada, id });
    const salvo = await this.clienteRepository.atualizar({
      id: cliente.id,
      nomeCompleto: cliente.nomeCompleto,
      whatsApp: cliente.whatsApp,
      profissao: cliente.profissao,
      email: cliente.email,
      instagram: cliente.instagram,
      facebook: cliente.facebook,
      dataNascimento: cliente.dataNascimento,
      endereco: cliente.endereco,
    });
    return ClienteMapper.paraDto(salvo);
  }

  async excluir(id) {
    const c = await this.clienteRepository.buscarPorId(id);
    if (!c) throw new NotFoundError('Cliente nao encontrado.');
    await this.clienteRepository.excluir(id);
  }
}
