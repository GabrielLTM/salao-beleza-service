import { env } from '../config/env.js';
import { prisma } from '../infrastructure/database/prismaClient.js';

// Repositorios
import { PrismaFuncionarioRepository } from '../infrastructure/repositories/PrismaFuncionarioRepository.js';
import { PrismaClienteRepository } from '../infrastructure/repositories/PrismaClienteRepository.js';
import { PrismaCategoriaRepository } from '../infrastructure/repositories/PrismaCategoriaRepository.js';
import { PrismaServicoRepository } from '../infrastructure/repositories/PrismaServicoRepository.js';
import { PrismaProdutoRepository } from '../infrastructure/repositories/PrismaProdutoRepository.js';
import { PrismaVendaRepository } from '../infrastructure/repositories/PrismaVendaRepository.js';
import { PrismaAgendaRepository } from '../infrastructure/repositories/PrismaAgendaRepository.js';
import { PrismaAgendamentoRepository } from '../infrastructure/repositories/PrismaAgendamentoRepository.js';

// Seguranca
import { BcryptHasher } from '../infrastructure/security/BcryptHasher.js';
import { JwtTokenService } from '../infrastructure/security/JwtTokenService.js';

// Use cases - auth
import { LoginFuncionario } from '../application/use-cases/auth/LoginFuncionario.js';

// Use cases - funcionarios
import { ListarFuncionarios } from '../application/use-cases/funcionarios/ListarFuncionarios.js';
import { BuscarFuncionarioPorId } from '../application/use-cases/funcionarios/BuscarFuncionarioPorId.js';
import { CriarFuncionario } from '../application/use-cases/funcionarios/CriarFuncionario.js';
import { EditarFuncionario } from '../application/use-cases/funcionarios/EditarFuncionario.js';
import { ExcluirFuncionario } from '../application/use-cases/funcionarios/ExcluirFuncionario.js';

// Use cases - clientes
import { ListarClientes } from '../application/use-cases/clientes/ListarClientes.js';
import { BuscarClientePorId } from '../application/use-cases/clientes/BuscarClientePorId.js';
import { CriarCliente } from '../application/use-cases/clientes/CriarCliente.js';
import { EditarCliente } from '../application/use-cases/clientes/EditarCliente.js';
import { ExcluirCliente } from '../application/use-cases/clientes/ExcluirCliente.js';

// Use cases - categorias
import { ListarCategorias } from '../application/use-cases/categorias/ListarCategorias.js';
import { BuscarCategoriaPorId } from '../application/use-cases/categorias/BuscarCategoriaPorId.js';
import { CriarCategoria } from '../application/use-cases/categorias/CriarCategoria.js';
import { EditarCategoria } from '../application/use-cases/categorias/EditarCategoria.js';
import { ExcluirCategoria } from '../application/use-cases/categorias/ExcluirCategoria.js';

// Use cases - servicos
import { ListarServicos } from '../application/use-cases/servicos/ListarServicos.js';
import { BuscarServicoPorId } from '../application/use-cases/servicos/BuscarServicoPorId.js';
import { CriarServico } from '../application/use-cases/servicos/CriarServico.js';
import { EditarServico } from '../application/use-cases/servicos/EditarServico.js';
import { ExcluirServico } from '../application/use-cases/servicos/ExcluirServico.js';

// Use cases - produtos
import { ListarProdutos } from '../application/use-cases/produtos/ListarProdutos.js';
import { BuscarProdutoPorId } from '../application/use-cases/produtos/BuscarProdutoPorId.js';
import { CriarProduto } from '../application/use-cases/produtos/CriarProduto.js';
import { EditarProduto } from '../application/use-cases/produtos/EditarProduto.js';
import { ExcluirProduto } from '../application/use-cases/produtos/ExcluirProduto.js';

// Use cases - vendas
import { RegistrarVenda } from '../application/use-cases/vendas/RegistrarVenda.js';
import { ListarVendas } from '../application/use-cases/vendas/ListarVendas.js';
import { BuscarVendaPorId } from '../application/use-cases/vendas/BuscarVendaPorId.js';

// Use cases - agenda
import { DefinirAgendaFuncionario } from '../application/use-cases/agenda/DefinirAgendaFuncionario.js';
import { ListarAgendaFuncionario } from '../application/use-cases/agenda/ListarAgendaFuncionario.js';
import { RemoverJanelaAgenda } from '../application/use-cases/agenda/RemoverJanelaAgenda.js';

// Use cases - agendamentos
import { ValidadorConflitoAgendamento } from '../application/use-cases/agendamentos/ValidadorConflitoAgendamento.js';
import { CriarAgendamento } from '../application/use-cases/agendamentos/CriarAgendamento.js';
import { EditarAgendamento } from '../application/use-cases/agendamentos/EditarAgendamento.js';
import { CancelarAgendamento } from '../application/use-cases/agendamentos/CancelarAgendamento.js';
import { ExcluirAgendamento } from '../application/use-cases/agendamentos/ExcluirAgendamento.js';
import { ListarAgendamentos } from '../application/use-cases/agendamentos/ListarAgendamentos.js';
import { BuscarAgendamentoPorId } from '../application/use-cases/agendamentos/BuscarAgendamentoPorId.js';

// Use cases - analise
import { DesempenhoPorFuncionario } from '../application/use-cases/analise/DesempenhoPorFuncionario.js';
import { ServicosMaisVendidos } from '../application/use-cases/analise/ServicosMaisVendidos.js';
import { FaturamentoPorPeriodo } from '../application/use-cases/analise/FaturamentoPorPeriodo.js';

// Controllers + middlewares
import { AuthController } from '../infrastructure/web/controllers/AuthController.js';
import { FuncionarioController } from '../infrastructure/web/controllers/FuncionarioController.js';
import { ClienteController } from '../infrastructure/web/controllers/ClienteController.js';
import { CategoriaController } from '../infrastructure/web/controllers/CategoriaController.js';
import { ServicoController } from '../infrastructure/web/controllers/ServicoController.js';
import { ProdutoController } from '../infrastructure/web/controllers/ProdutoController.js';
import { VendaController } from '../infrastructure/web/controllers/VendaController.js';
import { AgendaController } from '../infrastructure/web/controllers/AgendaController.js';
import { AgendamentoController } from '../infrastructure/web/controllers/AgendamentoController.js';
import { AnaliseController } from '../infrastructure/web/controllers/AnaliseController.js';
import { criarAutenticar } from '../infrastructure/web/middlewares/autenticar.js';

/**
 * Cria todas as dependencias e retorna um container imutavel.
 */
export function criarContainer() {
  // Infra
  const funcionarioRepository = new PrismaFuncionarioRepository(prisma);
  const clienteRepository = new PrismaClienteRepository(prisma);
  const categoriaRepository = new PrismaCategoriaRepository(prisma);
  const servicoRepository = new PrismaServicoRepository(prisma);
  const produtoRepository = new PrismaProdutoRepository(prisma);
  const vendaRepository = new PrismaVendaRepository(prisma);
  const agendaRepository = new PrismaAgendaRepository(prisma);
  const agendamentoRepository = new PrismaAgendamentoRepository(prisma);

  const hasher = new BcryptHasher(env.bcryptRounds);
  const tokenService = new JwtTokenService({ segredo: env.jwtSecret, expiraEm: env.jwtExpiresIn });

  // Use cases
  const loginFuncionario = new LoginFuncionario({ funcionarioRepository, hasher, tokenService });

  const funcionarioUseCases = {
    listar: new ListarFuncionarios({ funcionarioRepository }),
    buscarPorId: new BuscarFuncionarioPorId({ funcionarioRepository }),
    criar: new CriarFuncionario({ funcionarioRepository, hasher }),
    editar: new EditarFuncionario({ funcionarioRepository, hasher }),
    excluir: new ExcluirFuncionario({ funcionarioRepository }),
  };
  const clienteUseCases = {
    listar: new ListarClientes({ clienteRepository }),
    buscarPorId: new BuscarClientePorId({ clienteRepository }),
    criar: new CriarCliente({ clienteRepository }),
    editar: new EditarCliente({ clienteRepository }),
    excluir: new ExcluirCliente({ clienteRepository }),
  };
  const categoriaUseCases = {
    listar: new ListarCategorias({ categoriaRepository }),
    buscarPorId: new BuscarCategoriaPorId({ categoriaRepository }),
    criar: new CriarCategoria({ categoriaRepository, servicoRepository }),
    editar: new EditarCategoria({ categoriaRepository, servicoRepository }),
    excluir: new ExcluirCategoria({ categoriaRepository }),
  };
  const servicoUseCases = {
    listar: new ListarServicos({ servicoRepository }),
    buscarPorId: new BuscarServicoPorId({ servicoRepository }),
    criar: new CriarServico({ servicoRepository, categoriaRepository }),
    editar: new EditarServico({ servicoRepository, categoriaRepository }),
    excluir: new ExcluirServico({ servicoRepository }),
  };
  const produtoUseCases = {
    listar: new ListarProdutos({ produtoRepository }),
    buscarPorId: new BuscarProdutoPorId({ produtoRepository }),
    criar: new CriarProduto({ produtoRepository }),
    editar: new EditarProduto({ produtoRepository }),
    excluir: new ExcluirProduto({ produtoRepository }),
  };
  const vendaUseCases = {
    registrar: new RegistrarVenda({
      vendaRepository,
      funcionarioRepository,
      clienteRepository,
      produtoRepository,
      servicoRepository,
    }),
    listar: new ListarVendas({ vendaRepository }),
    buscarPorId: new BuscarVendaPorId({ vendaRepository }),
  };
  const agendaUseCases = {
    listarAgenda: new ListarAgendaFuncionario({ agendaRepository, funcionarioRepository }),
    definirAgenda: new DefinirAgendaFuncionario({ agendaRepository, funcionarioRepository }),
    removerJanela: new RemoverJanelaAgenda({ agendaRepository }),
  };
  const validadorConflito = new ValidadorConflitoAgendamento({
    clienteRepository,
    funcionarioRepository,
    servicoRepository,
    agendaRepository,
    agendamentoRepository,
  });
  const agendamentoUseCases = {
    listar: new ListarAgendamentos({ agendamentoRepository }),
    buscarPorId: new BuscarAgendamentoPorId({ agendamentoRepository }),
    criar: new CriarAgendamento({ agendamentoRepository, validadorConflito }),
    editar: new EditarAgendamento({ agendamentoRepository, validadorConflito }),
    cancelar: new CancelarAgendamento({ agendamentoRepository }),
    excluir: new ExcluirAgendamento({ agendamentoRepository }),
  };
  const analiseUseCases = {
    desempenhoPorFuncionario: new DesempenhoPorFuncionario({
      funcionarioRepository,
      agendamentoRepository,
      vendaRepository,
    }),
    servicosMaisVendidos: new ServicosMaisVendidos({ vendaRepository, servicoRepository }),
    faturamentoPorPeriodo: new FaturamentoPorPeriodo({ vendaRepository }),
  };

  // Controllers
  const controllers = {
    auth: new AuthController({ loginFuncionario }),
    funcionarios: new FuncionarioController(funcionarioUseCases),
    clientes: new ClienteController(clienteUseCases),
    categorias: new CategoriaController(categoriaUseCases),
    servicos: new ServicoController(servicoUseCases),
    produtos: new ProdutoController(produtoUseCases),
    vendas: new VendaController(vendaUseCases),
    agenda: new AgendaController(agendaUseCases),
    agendamentos: new AgendamentoController(agendamentoUseCases),
    analise: new AnaliseController(analiseUseCases),
  };

  const autenticar = criarAutenticar(tokenService);

  return Object.freeze({ prisma, autenticar, controllers });
}
