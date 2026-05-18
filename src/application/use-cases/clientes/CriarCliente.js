import { Cliente } from '../../../domain/entities/Cliente.js';
import { ClienteMapper } from '../../mappers/ClienteMapper.js';

export class CriarCliente {
  constructor({ clienteRepository }) { this.clienteRepository = clienteRepository; }
  async executar(entrada) {
    const cliente = new Cliente(entrada);
    const salvo = await this.clienteRepository.criar({
      id: cliente.id,
      nomeCompleto: cliente.nomeCompleto,
      whatsApp: cliente.whatsApp,
      dataNascimento: cliente.dataNascimento,
      endereco: cliente.endereco,
    });
    return ClienteMapper.paraDto(salvo);
  }
}
