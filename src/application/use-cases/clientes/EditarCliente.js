import { Cliente } from '../../../domain/entities/Cliente.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ClienteMapper } from '../../mappers/ClienteMapper.js';

export class EditarCliente {
  constructor({ clienteRepository }) { this.clienteRepository = clienteRepository; }
  async executar(id, entrada) {
    const atual = await this.clienteRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Cliente nao encontrado.');
    const cliente = new Cliente({ ...entrada, id });
    const salvo = await this.clienteRepository.atualizar({
      id: cliente.id,
      nomeCompleto: cliente.nomeCompleto,
      whatsApp: cliente.whatsApp,
      dataNascimento: cliente.dataNascimento,
      endereco: cliente.endereco,
    });
    return ClienteMapper.paraDto(salvo);
  }
}
