# Salao API — Backend (Node.js + MongoDB Atlas)

API REST para controle de **funcionarios, clientes, produtos, categorias, servicos, vendas, agenda, agendamentos** e **analise de desempenho** de um salao de beleza. Backend desenvolvido em **Node.js + Express + Prisma (MongoDB Atlas)**, seguindo principios de **Clean Architecture** e **SOLID**.

Front-end (responsabilidade de outro time) consome este backend respeitando o contrato definido em `Regra geral.txt`:

- JSON em **camelCase**.
- IDs em **GUID** (string UUID v4).
- Respostas padronizadas no envelope: `{ sucesso, mensagem, erros, dados }`.

---

## Stack

- Node.js >= 20 (ES Modules)
- Express
- Prisma ORM com provider `mongodb`
- JWT + bcrypt para autenticacao
- Zod para validacao de input
- Pino para logs

---

## Arquitetura

```
src/
  domain/          regras de negocio puras (entidades, value objects, erros, contratos)
  application/     casos de uso (1 arquivo por operacao), DTOs, mappers
  infrastructure/  Prisma (repos), seguranca (bcrypt/jwt), Express (controllers, rotas, middlewares)
  composition/     raiz de composicao (DI manual)
  config/          parsing/validacao das envs
  main.js          entry point
prisma/
  schema.prisma    modelo de dados (provider mongodb)
  seed.js          cria administrador inicial
```

Dependencias **sempre apontam para dentro**: controllers/rotas → use cases → entidades/contratos.
Implementacoes concretas (Prisma, bcrypt, JWT) ficam em `infrastructure` e sao injetadas pelo `container.js`.

---

## Setup

### 1) Configurar MongoDB Atlas

Crie um cluster em [cloud.mongodb.com](https://cloud.mongodb.com), libere o IP da sua maquina em **Network Access**, e crie um usuario com role `readWrite` no banco `salao`.

### 2) Instalar dependencias

```bash
npm install
```

### 3) Variaveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/salao?retryWrites=true&w=majority"
JWT_SECRET="troque-isto-em-producao"
JWT_EXPIRES_IN="8h"
BCRYPT_ROUNDS=10
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

### 4) Aplicar schema no Atlas

```bash
npm run prisma:generate
npm run prisma:push
```

> MongoDB com Prisma **nao usa migrations SQL**. O schema eh aplicado direto com `prisma db push`.

### 5) Criar administrador inicial

```bash
npm run seed
```

Cria o usuario:
- email: `admin@salao.local`
- senha: `admin123`
- nivelPermissao: 4 (Administrador)

### 6) Subir o servidor

```bash
npm run dev
```

A API escuta em `http://localhost:3000`.

---

## Autenticacao

Todas as rotas (exceto `/saude` e `/auth/login`) exigem header:

```
Authorization: Bearer <token>
```

Login:

```http
POST /auth/login
Content-Type: application/json

{ "email": "admin@salao.local", "senha": "admin123" }
```

Resposta:

```json
{
  "sucesso": true,
  "mensagem": "Autenticado com sucesso.",
  "erros": [],
  "dados": {
    "token": "<JWT>",
    "funcionario": { "id": "...", "nomeCompleto": "Administrador", "email": "admin@salao.local", "nivelPermissao": 4 }
  }
}
```

### Niveis de permissao

| Nivel | Significado |
|-------|-------------|
| 1 | Recepcao |
| 2 | Profissional |
| 3 | Gerente |
| 4 | Administrador |

Endpoints de escrita em `funcionarios`, `categorias`, `servicos`, `produtos`, `agenda` e toda `analise` exigem **nivel >= 3 (Gerente)**.

---

## Rotas

Padrao CRUD:

```
GET    /{recurso}            lista paginada (?pagina=1&tamanho=20)
GET    /{recurso}/{id}       um registro
POST   /{recurso}            cria
PUT    /{recurso}/{id}       edita
DELETE /{recurso}/{id}       exclui
```

| Recurso | Rotas extras |
|---------|--------------|
| `/auth` | `POST /auth/login` |
| `/funcionarios` | CRUD |
| `/clientes` | CRUD |
| `/categorias` | CRUD |
| `/servicos` | CRUD |
| `/produtos` | CRUD |
| `/vendas` | `GET /vendas`, `GET /vendas/:id`, `POST /vendas` |
| `/agenda` | `GET /agenda/funcionarios/:id`, `PUT /agenda/funcionarios/:id`, `DELETE /agenda/janelas/:id` |
| `/agendamentos` | CRUD + `PATCH /agendamentos/:id/cancelar` |
| `/analise` | `GET /analise/funcionarios?inicio=&fim=`, `GET /analise/servicos?inicio=&fim=&limite=`, `GET /analise/faturamento?inicio=&fim=` |

### Exemplos de payload

**Funcionario (POST /funcionarios):**
```json
{
  "nomeCompleto": "Maria Silva",
  "endereco": "Rua A, 123",
  "telefone": "51999990000",
  "profissaoCargo": "Cabeleireira",
  "email": "maria@salao.local",
  "senha": "minhasenha123",
  "dataNascimento": "1990-05-12",
  "nivelPermissao": 2,
  "status": 1
}
```

**Servico (POST /servicos):**
```json
{
  "nome": "Corte feminino",
  "duracaoMinutos": 45,
  "precoMinimo": 60.00,
  "categoriaId": "<guid-da-categoria>",
  "status": 1
}
```

**Categoria (POST /categorias):**
```json
{ "nome": "Cabelo", "servicoIds": ["<guid-servico-1>", "<guid-servico-2>"] }
```

**Agenda do funcionario (PUT /agenda/funcionarios/:id):**
```json
{
  "janelas": [
    { "diaSemana": 1, "horaInicio": "09:00", "horaFim": "12:00" },
    { "diaSemana": 1, "horaInicio": "13:00", "horaFim": "18:00" }
  ]
}
```

> `diaSemana`: 0=domingo, 6=sabado.

**Agendamento (POST /agendamentos):**
```json
{
  "clienteId": "<guid>",
  "funcionarioId": "<guid>",
  "servicoId": "<guid>",
  "dataHoraInicio": "2026-06-01T14:00:00-03:00"
}
```

> O `dataHoraFim` eh calculado a partir de `duracaoMinutos` do servico. Conflito com outro agendamento ATIVO ou horario fora da janela da agenda retornam **409**.

**Venda (POST /vendas):**
```json
{
  "funcionarioId": "<guid>",
  "clienteId": "<guid|null>",
  "itens": [
    { "tipo": "SERVICO", "servicoId": "<guid>", "quantidade": 1, "valorUnitario": 80.00 },
    { "tipo": "PRODUTO", "produtoId": "<guid>", "quantidade": 2, "valorUnitario": 25.50 }
  ]
}
```

Total eh calculado no servidor.

---

## Envelope de resposta

Todas as rotas respondem com:

```json
{
  "sucesso": true,
  "mensagem": "...",
  "erros": [],
  "dados": { ... }
}
```

Em erros de validacao (`422`), conflito (`409`), nao encontrado (`404`), nao autenticado (`401`) ou nao autorizado (`403`):

```json
{ "sucesso": false, "mensagem": "...", "erros": ["..."], "dados": null }
```

---

## Convencoes de codigo (Clean Code + SOLID)

- **1 use case = 1 arquivo = 1 responsabilidade** (SRP).
- Use cases dependem **somente de interfaces de repositorio** (DIP). `infrastructure/repositories/Prisma*` injeta a implementacao concreta.
- Erros de dominio (`ValidationError`, `NotFoundError`, `ConflictError`, `Unauthorized/ForbiddenError`) sao traduzidos automaticamente para HTTP pelo `tratadorDeErros`.
- Mappers (`application/mappers/*`) cuidam de conversao entre registro persistido e DTO da API.
- IDs sao GUID (string UUID v4) gerados via `crypto.randomUUID()`.

---

## Scripts

```bash
npm run dev              # subir API com hot-reload
npm run start            # subir API em modo producao
npm run seed             # cria administrador inicial
npm run prisma:generate  # gerar Prisma Client
npm run prisma:push      # aplicar schema no Atlas
npm run prisma:studio    # abrir Prisma Studio
npm run lint             # eslint
npm test                 # jest (a suite cobre os use cases principais)
```
