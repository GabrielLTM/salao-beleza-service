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

// Services (1 por recurso, todas operacoes do banco concentradas)
import { AuthService } from '../application/services/AuthService.js';
import { FuncionarioService } from '../application/services/FuncionarioService.js';
import { ClienteService } from '../application/services/ClienteService.js';
import { CategoriaService } from '../application/services/CategoriaService.js';
import { ServicoService } from '../application/services/ServicoService.js';
import { ProdutoService } from '../application/services/ProdutoService.js';
import { VendaService } from '../application/services/VendaService.js';
import { AgendaService } from '../application/services/AgendaService.js';
import { AgendamentoService } from '../application/services/AgendamentoService.js';
import { AnaliseService } from '../application/services/AnaliseService.js';

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
  // Repositorios
  const funcionarioRepository = new PrismaFuncionarioRepository(prisma);
  const clienteRepository = new PrismaClienteRepository(prisma);
  const categoriaRepository = new PrismaCategoriaRepository(prisma);
  const servicoRepository = new PrismaServicoRepository(prisma);
  const produtoRepository = new PrismaProdutoRepository(prisma);
  const vendaRepository = new PrismaVendaRepository(prisma);
  const agendaRepository = new PrismaAgendaRepository(prisma);
  const agendamentoRepository = new PrismaAgendamentoRepository(prisma);

  // Infra de seguranca
  const hasher = new BcryptHasher(env.bcryptRounds);
  const tokenService = new JwtTokenService({ segredo: env.jwtSecret, expiraEm: env.jwtExpiresIn });

  // Services
  const authService = new AuthService({ funcionarioRepository, hasher, tokenService });
  const funcionarioService = new FuncionarioService({ funcionarioRepository, hasher });
  const clienteService = new ClienteService({ clienteRepository });
  const categoriaService = new CategoriaService({ categoriaRepository, servicoRepository });
  const servicoService = new ServicoService({ servicoRepository, categoriaRepository });
  const produtoService = new ProdutoService({ produtoRepository });
  const vendaService = new VendaService({
    vendaRepository,
    funcionarioRepository,
    clienteRepository,
    produtoRepository,
    servicoRepository,
  });
  const agendaService = new AgendaService({ agendaRepository, funcionarioRepository });
  const agendamentoService = new AgendamentoService({
    agendamentoRepository,
    clienteRepository,
    funcionarioRepository,
    servicoRepository,
    agendaRepository,
  });
  const analiseService = new AnaliseService({
    funcionarioRepository,
    agendamentoRepository,
    vendaRepository,
    servicoRepository,
  });

  // Controllers
  const controllers = {
    auth: new AuthController({ authService }),
    funcionarios: new FuncionarioController({ funcionarioService }),
    clientes: new ClienteController({ clienteService }),
    categorias: new CategoriaController({ categoriaService }),
    servicos: new ServicoController({ servicoService }),
    produtos: new ProdutoController({ produtoService }),
    vendas: new VendaController({ vendaService }),
    agenda: new AgendaController({ agendaService }),
    agendamentos: new AgendamentoController({ agendamentoService }),
    analise: new AnaliseController({ analiseService }),
  };

  const autenticar = criarAutenticar(tokenService);

  return Object.freeze({ prisma, autenticar, controllers });
}
