/**
 * Spec OpenAPI 3 da API do Salao.
 * Servido em /docs via swagger-ui-express.
 */
export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Salao API',
    version: '1.0.0',
    description:
      'API REST para controle de funcionarios, clientes, produtos, categorias, servicos, vendas, agenda e agendamentos de um salao de beleza.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Resultado: {
        type: 'object',
        required: ['sucesso', 'mensagem', 'erros', 'dados'],
        properties: {
          sucesso: { type: 'boolean' },
          mensagem: { type: 'string' },
          erros: { type: 'array', items: { type: 'string' } },
          dados: { nullable: true },
        },
      },
      Paginacao: {
        type: 'object',
        properties: {
          pagina: { type: 'integer', minimum: 1 },
          tamanho: { type: 'integer', minimum: 1, maximum: 100 },
          total: { type: 'integer' },
          itens: { type: 'array', items: { type: 'object' } },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 1 },
        },
      },
      LoginResposta: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          funcionario: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              nomeCompleto: { type: 'string' },
              email: { type: 'string', format: 'email' },
              nivelPermissao: { type: 'integer', enum: [1, 2, 3, 4] },
            },
          },
        },
      },
      Funcionario: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nomeCompleto: { type: 'string' },
          cpf: { type: 'string', nullable: true, description: '11 digitos (apenas numeros).' },
          endereco: { type: 'string', nullable: true },
          telefone: { type: 'string', nullable: true },
          profissoes: { type: 'array', items: { type: 'string' } },
          email: { type: 'string', format: 'email' },
          dataNascimento: { type: 'string', format: 'date-time', nullable: true },
          dataAdmissao: { type: 'string', format: 'date-time', nullable: true, description: 'Data de entrada na empresa.' },
          nivelPermissao: { type: 'integer', enum: [1, 2, 3, 4], description: '1=Recepcao, 2=Profissional, 3=Gerente, 4=Administrador' },
          status: { type: 'integer', enum: [0, 1], description: '0=Inativo, 1=Ativo' },
          percentualComissaoProduto: { type: 'number', minimum: 0, maximum: 100, description: '% que o funcionario ganha sobre o percentual de comissao do produto.' },
          percentualComissaoServico: { type: 'number', minimum: 0, maximum: 100, description: '% que o funcionario ganha sobre o percentual de comissao do servico.' },
        },
      },
      FuncionarioCadastro: {
        type: 'object',
        required: ['nomeCompleto', 'profissoes', 'email', 'senha', 'nivelPermissao', 'status'],
        properties: {
          nomeCompleto: { type: 'string', minLength: 2 },
          cpf: { type: 'string', pattern: '^\\d{11}$', nullable: true, description: '11 digitos (apenas numeros). Unico quando informado.' },
          endereco: { type: 'string', nullable: true },
          telefone: { type: 'string', nullable: true },
          profissoes: { type: 'array', minItems: 1, items: { type: 'string', minLength: 2 } },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 6 },
          dataNascimento: { type: 'string', nullable: true },
          dataAdmissao: { type: 'string', nullable: true, description: 'Data de entrada na empresa (ISO-8601 ou YYYY-MM-DD).' },
          nivelPermissao: { type: 'integer', enum: [1, 2, 3, 4] },
          status: { type: 'integer', enum: [0, 1] },
          percentualComissaoProduto: { type: 'number', minimum: 0, maximum: 100, default: 0 },
          percentualComissaoServico: { type: 'number', minimum: 0, maximum: 100, default: 0 },
        },
      },
      FuncionarioEdicao: {
        allOf: [
          { $ref: '#/components/schemas/FuncionarioCadastro' },
          {
            type: 'object',
            properties: { senha: { type: 'string', minLength: 6, nullable: true } },
          },
        ],
      },
      Cliente: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nomeCompleto: { type: 'string' },
          whatsApp: { type: 'string' },
          profissao: { type: 'array', items: { type: 'string' }, description: 'Uma ou mais profissoes.' },
          email: { type: 'string', format: 'email', nullable: true },
          instagram: { type: 'string', nullable: true },
          facebook: { type: 'string', nullable: true },
          dataNascimento: { type: 'string', format: 'date-time', nullable: true },
          endereco: { type: 'string', nullable: true },
        },
      },
      ClienteCadastro: {
        type: 'object',
        required: ['nomeCompleto', 'whatsApp'],
        properties: {
          nomeCompleto: { type: 'string', minLength: 2 },
          whatsApp: { type: 'string', minLength: 8 },
          profissao: { type: 'array', items: { type: 'string' }, description: 'Uma ou mais profissoes.' },
          email: { type: 'string', format: 'email', nullable: true },
          instagram: { type: 'string', nullable: true },
          facebook: { type: 'string', nullable: true },
          dataNascimento: { type: 'string', nullable: true },
          endereco: { type: 'string', nullable: true },
        },
      },
      Produto: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          valor: { type: 'number' },
          caminhoImagem: { type: 'string', nullable: true },
          status: { type: 'integer', enum: [0, 1] },
          percentualComissao: { type: 'number', minimum: 0, maximum: 100, description: '% do valor do produto que serve de base para a comissao.' },
        },
      },
      ProdutoCadastro: {
        type: 'object',
        required: ['nome', 'valor', 'status'],
        properties: {
          nome: { type: 'string', minLength: 1 },
          valor: { type: 'number', minimum: 0 },
          caminhoImagem: { type: 'string', nullable: true },
          status: { type: 'integer', enum: [0, 1] },
          percentualComissao: { type: 'number', minimum: 0, maximum: 100, default: 0 },
        },
      },
      Servico: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          duracaoMinutos: { type: 'integer' },
          precoMinimo: { type: 'number' },
          categoriaId: { type: 'string', format: 'uuid' },
          nomeCategoria: { type: 'string', nullable: true },
          status: { type: 'integer', enum: [0, 1] },
          percentualComissao: { type: 'number', minimum: 0, maximum: 100, description: '% do valor do servico que serve de base para a comissao.' },
        },
      },
      ServicoCadastro: {
        type: 'object',
        required: ['nome', 'duracaoMinutos', 'precoMinimo', 'categoriaId', 'status'],
        properties: {
          nome: { type: 'string', minLength: 2 },
          duracaoMinutos: { type: 'integer', minimum: 1 },
          precoMinimo: { type: 'number', minimum: 0 },
          categoriaId: { type: 'string', format: 'uuid' },
          status: { type: 'integer', enum: [0, 1] },
          percentualComissao: { type: 'number', minimum: 0, maximum: 100, default: 0 },
        },
      },
      Categoria: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          servicoIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
          nomesServicosVinculados: { type: 'array', items: { type: 'string' } },
        },
      },
      CategoriaCadastro: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string', minLength: 2 },
          servicoIds: { type: 'array', items: { type: 'string' } },
        },
      },
      ItemVenda: {
        type: 'object',
        required: ['tipo', 'quantidade', 'valorUnitario'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          tipo: { type: 'string', enum: ['PRODUTO', 'SERVICO'] },
          produtoId: { type: 'string', format: 'uuid', nullable: true },
          servicoId: { type: 'string', format: 'uuid', nullable: true },
          quantidade: { type: 'integer', minimum: 1 },
          valorUnitario: { type: 'number', minimum: 0 },
          percentualComissaoBase: { type: 'number', readOnly: true, description: '% de comissao do item congelado na venda.' },
          percentualComissaoFuncionario: { type: 'number', readOnly: true, description: '% do funcionario congelado na venda.' },
          valorComissao: { type: 'number', readOnly: true, description: 'Comissao calculada: valor x %item x %funcionario.' },
        },
      },
      Venda: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          dataHora: { type: 'string', format: 'date-time' },
          total: { type: 'number' },
          funcionarioId: { type: 'string', format: 'uuid' },
          clienteId: { type: 'string', format: 'uuid', nullable: true },
          itens: { type: 'array', items: { $ref: '#/components/schemas/ItemVenda' } },
        },
      },
      VendaCadastro: {
        type: 'object',
        required: ['funcionarioId', 'itens'],
        properties: {
          funcionarioId: { type: 'string', format: 'uuid' },
          clienteId: { type: 'string', format: 'uuid', nullable: true },
          dataHora: { type: 'string', format: 'date-time' },
          itens: { type: 'array', minItems: 1, items: { $ref: '#/components/schemas/ItemVenda' } },
        },
      },
      JanelaAgenda: {
        type: 'object',
        required: ['diaSemana', 'horaInicio', 'horaFim'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          funcionarioId: { type: 'string', format: 'uuid' },
          diaSemana: { type: 'integer', minimum: 0, maximum: 6, description: '0=domingo, 6=sabado' },
          horaInicio: { type: 'string', example: '09:00' },
          horaFim: { type: 'string', example: '18:00' },
        },
      },
      DefinirAgenda: {
        type: 'object',
        required: ['janelas'],
        properties: {
          janelas: { type: 'array', items: { $ref: '#/components/schemas/JanelaAgenda' } },
        },
      },
      Agendamento: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          clienteId: { type: 'string', format: 'uuid' },
          funcionarioId: { type: 'string', format: 'uuid' },
          servicoIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
          dataHoraInicio: { type: 'string', format: 'date-time' },
          dataHoraFim: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['AGENDADO', 'CONCLUIDO', 'CANCELADO'] },
        },
      },
      AgendamentoCadastro: {
        type: 'object',
        required: ['clienteId', 'funcionarioId', 'servicoIds', 'dataHoraInicio'],
        properties: {
          clienteId: { type: 'string', format: 'uuid' },
          funcionarioId: { type: 'string', format: 'uuid' },
          servicoIds: { type: 'array', minItems: 1, items: { type: 'string', format: 'uuid' } },
          dataHoraInicio: { type: 'string', format: 'date-time' },
        },
      },
    },
    parameters: {
      Pagina: { in: 'query', name: 'pagina', schema: { type: 'integer', minimum: 1, default: 1 } },
      Tamanho: { in: 'query', name: 'tamanho', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
      IdPath: { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
    },
    responses: {
      Sucesso: {
        description: 'Operacao bem-sucedida',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Resultado' } } },
      },
      ErroValidacao: {
        description: 'Dados invalidos (422)',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Resultado' } } },
      },
      NaoAutenticado: {
        description: 'Token ausente ou invalido (401)',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Resultado' } } },
      },
      Proibido: {
        description: 'Nivel de permissao insuficiente (403)',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Resultado' } } },
      },
      NaoEncontrado: {
        description: 'Recurso nao encontrado (404)',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Resultado' } } },
      },
      Conflito: {
        description: 'Conflito com estado atual (409)',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Resultado' } } },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Saude' },
    { name: 'Auth' },
    { name: 'Funcionarios' },
    { name: 'Clientes' },
    { name: 'Categorias' },
    { name: 'Servicos' },
    { name: 'Produtos' },
    { name: 'Vendas' },
    { name: 'Agenda' },
    { name: 'Agendamentos' },
    { name: 'Analise' },
  ],
  paths: {
    '/saude': {
      get: {
        tags: ['Saude'],
        summary: 'Health check da API',
        security: [],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autentica funcionario e retorna JWT',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'Token emitido',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Resultado' } } },
          },
          401: { $ref: '#/components/responses/NaoAutenticado' },
        },
      },
    },
    '/funcionarios': {
      get: {
        tags: ['Funcionarios'],
        summary: 'Lista funcionarios (paginado)',
        parameters: [
          { $ref: '#/components/parameters/Pagina' },
          { $ref: '#/components/parameters/Tamanho' },
        ],
        responses: {
          200: { $ref: '#/components/responses/Sucesso' },
          401: { $ref: '#/components/responses/NaoAutenticado' },
        },
      },
      post: {
        tags: ['Funcionarios'],
        summary: 'Cria funcionario (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/FuncionarioCadastro' } } },
        },
        responses: {
          201: { $ref: '#/components/responses/Sucesso' },
          409: { $ref: '#/components/responses/Conflito' },
          422: { $ref: '#/components/responses/ErroValidacao' },
        },
      },
    },
    '/funcionarios/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      get: {
        tags: ['Funcionarios'],
        summary: 'Busca funcionario por id',
        responses: { 200: { $ref: '#/components/responses/Sucesso' }, 404: { $ref: '#/components/responses/NaoEncontrado' } },
      },
      put: {
        tags: ['Funcionarios'],
        summary: 'Edita funcionario (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/FuncionarioEdicao' } } },
        },
        responses: {
          200: { $ref: '#/components/responses/Sucesso' },
          404: { $ref: '#/components/responses/NaoEncontrado' },
          409: { $ref: '#/components/responses/Conflito' },
        },
      },
      delete: {
        tags: ['Funcionarios'],
        summary: 'Exclui funcionario (nivel >= 3)',
        responses: { 200: { $ref: '#/components/responses/Sucesso' }, 404: { $ref: '#/components/responses/NaoEncontrado' } },
      },
    },
    '/clientes': {
      get: {
        tags: ['Clientes'],
        summary: 'Lista clientes (paginado)',
        parameters: [
          { $ref: '#/components/parameters/Pagina' },
          { $ref: '#/components/parameters/Tamanho' },
        ],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Cria cliente',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ClienteCadastro' } } },
        },
        responses: { 201: { $ref: '#/components/responses/Sucesso' }, 422: { $ref: '#/components/responses/ErroValidacao' } },
      },
    },
    '/clientes/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      get: { tags: ['Clientes'], summary: 'Busca cliente por id', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
      put: {
        tags: ['Clientes'],
        summary: 'Edita cliente',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ClienteCadastro' } } },
        },
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      delete: { tags: ['Clientes'], summary: 'Exclui cliente', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
    },
    '/categorias': {
      get: {
        tags: ['Categorias'],
        summary: 'Lista categorias com servicos vinculados',
        parameters: [{ $ref: '#/components/parameters/Pagina' }, { $ref: '#/components/parameters/Tamanho' }],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      post: {
        tags: ['Categorias'],
        summary: 'Cria categoria (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriaCadastro' } } },
        },
        responses: { 201: { $ref: '#/components/responses/Sucesso' } },
      },
    },
    '/categorias/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      get: { tags: ['Categorias'], summary: 'Busca categoria por id', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
      put: {
        tags: ['Categorias'],
        summary: 'Edita categoria (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriaCadastro' } } },
        },
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      delete: {
        tags: ['Categorias'],
        summary: 'Exclui categoria (nivel >= 3, falha se houver servicos vinculados)',
        responses: { 200: { $ref: '#/components/responses/Sucesso' }, 409: { $ref: '#/components/responses/Conflito' } },
      },
    },
    '/servicos': {
      get: {
        tags: ['Servicos'],
        summary: 'Lista servicos (paginado, enriquecido com nomeCategoria)',
        parameters: [{ $ref: '#/components/parameters/Pagina' }, { $ref: '#/components/parameters/Tamanho' }],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      post: {
        tags: ['Servicos'],
        summary: 'Cria servico (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ServicoCadastro' } } },
        },
        responses: { 201: { $ref: '#/components/responses/Sucesso' }, 404: { $ref: '#/components/responses/NaoEncontrado' } },
      },
    },
    '/servicos/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      get: { tags: ['Servicos'], summary: 'Busca servico por id', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
      put: {
        tags: ['Servicos'],
        summary: 'Edita servico (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ServicoCadastro' } } },
        },
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      delete: { tags: ['Servicos'], summary: 'Exclui servico (nivel >= 3)', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
    },
    '/produtos': {
      get: {
        tags: ['Produtos'],
        summary: 'Lista produtos (paginado)',
        parameters: [{ $ref: '#/components/parameters/Pagina' }, { $ref: '#/components/parameters/Tamanho' }],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      post: {
        tags: ['Produtos'],
        summary: 'Cria produto (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProdutoCadastro' } } },
        },
        responses: { 201: { $ref: '#/components/responses/Sucesso' } },
      },
    },
    '/produtos/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      get: { tags: ['Produtos'], summary: 'Busca produto por id', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
      put: {
        tags: ['Produtos'],
        summary: 'Edita produto (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProdutoCadastro' } } },
        },
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      delete: { tags: ['Produtos'], summary: 'Exclui produto (nivel >= 3)', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
    },
    '/vendas': {
      get: {
        tags: ['Vendas'],
        summary: 'Lista vendas (paginado, filtros opcionais)',
        parameters: [
          { $ref: '#/components/parameters/Pagina' },
          { $ref: '#/components/parameters/Tamanho' },
          { in: 'query', name: 'funcionarioId', schema: { type: 'string' } },
          { in: 'query', name: 'clienteId', schema: { type: 'string' } },
        ],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      post: {
        tags: ['Vendas'],
        summary: 'Registra venda (total calculado no servidor)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/VendaCadastro' } } },
        },
        responses: { 201: { $ref: '#/components/responses/Sucesso' }, 404: { $ref: '#/components/responses/NaoEncontrado' } },
      },
    },
    '/vendas/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      get: { tags: ['Vendas'], summary: 'Busca venda por id', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
    },
    '/agenda/funcionarios/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      get: {
        tags: ['Agenda'],
        summary: 'Lista janelas de agenda do funcionario',
        responses: { 200: { $ref: '#/components/responses/Sucesso' }, 404: { $ref: '#/components/responses/NaoEncontrado' } },
      },
      put: {
        tags: ['Agenda'],
        summary: 'Substitui a agenda inteira do funcionario (nivel >= 3)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/DefinirAgenda' } } },
        },
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
    },
    '/agenda/janelas/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      delete: {
        tags: ['Agenda'],
        summary: 'Remove janela individual (nivel >= 3)',
        responses: { 200: { $ref: '#/components/responses/Sucesso' }, 404: { $ref: '#/components/responses/NaoEncontrado' } },
      },
    },
    '/agendamentos': {
      get: {
        tags: ['Agendamentos'],
        summary: 'Lista agendamentos (paginado, filtros opcionais)',
        parameters: [
          { $ref: '#/components/parameters/Pagina' },
          { $ref: '#/components/parameters/Tamanho' },
          { in: 'query', name: 'funcionarioId', schema: { type: 'string' } },
          { in: 'query', name: 'clienteId', schema: { type: 'string' } },
          { in: 'query', name: 'inicio', schema: { type: 'string', format: 'date-time' } },
          { in: 'query', name: 'fim', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
      post: {
        tags: ['Agendamentos'],
        summary: 'Cria agendamento (valida conflito de horario)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AgendamentoCadastro' } } },
        },
        responses: {
          201: { $ref: '#/components/responses/Sucesso' },
          404: { $ref: '#/components/responses/NaoEncontrado' },
          409: { $ref: '#/components/responses/Conflito' },
        },
      },
    },
    '/agendamentos/{id}': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      get: { tags: ['Agendamentos'], summary: 'Busca agendamento por id', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
      put: {
        tags: ['Agendamentos'],
        summary: 'Edita agendamento (revalida conflito)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AgendamentoCadastro' } } },
        },
        responses: { 200: { $ref: '#/components/responses/Sucesso' }, 409: { $ref: '#/components/responses/Conflito' } },
      },
      delete: { tags: ['Agendamentos'], summary: 'Exclui agendamento', responses: { 200: { $ref: '#/components/responses/Sucesso' } } },
    },
    '/agendamentos/{id}/cancelar': {
      parameters: [{ $ref: '#/components/parameters/IdPath' }],
      patch: {
        tags: ['Agendamentos'],
        summary: 'Soft-cancel (status = CANCELADO, libera horario)',
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
    },
    '/analise/funcionarios': {
      get: {
        tags: ['Analise'],
        summary: 'Desempenho por funcionario no periodo (nivel >= 3). Inclui totalFaturado e comissao (total, produto, servico).',
        parameters: [
          { in: 'query', name: 'inicio', required: true, schema: { type: 'string', format: 'date-time' } },
          { in: 'query', name: 'fim', required: true, schema: { type: 'string', format: 'date-time' } },
        ],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
    },
    '/analise/servicos': {
      get: {
        tags: ['Analise'],
        summary: 'Ranking dos servicos mais vendidos (nivel >= 3)',
        parameters: [
          { in: 'query', name: 'inicio', required: true, schema: { type: 'string', format: 'date-time' } },
          { in: 'query', name: 'fim', required: true, schema: { type: 'string', format: 'date-time' } },
          { in: 'query', name: 'limite', schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 } },
        ],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
    },
    '/analise/faturamento': {
      get: {
        tags: ['Analise'],
        summary: 'Faturamento total no periodo (nivel >= 3)',
        parameters: [
          { in: 'query', name: 'inicio', required: true, schema: { type: 'string', format: 'date-time' } },
          { in: 'query', name: 'fim', required: true, schema: { type: 'string', format: 'date-time' } },
        ],
        responses: { 200: { $ref: '#/components/responses/Sucesso' } },
      },
    },
  },
};
