# Delivery Tracker — Exercício do Capítulo 4

> **Programação Web II — IFAL/Maceió.** Este é o **projeto do semestre** (avaliado). No Cap. 4 você
> inicia a **Delivery Tracker API** com **arquitetura em camadas** e, depois, **Repository Pattern +
> injeção de dependência**. A correção é **automática** (autograder de conformidade) + arquitetura.

## Como usar este repositório

1. Clique em **"Use this template"** e crie **`pweb2-delivery-<matricula>`** (ex.: `pweb2-delivery-20231012345`).
   Este é o repositório que você usará o **semestre inteiro** (evolui a cada capítulo).
2. Clone, instale e rode:
   ```bash
   npm install
   npm start                                        # http://localhost:3000
   # em outro terminal — autograder:
   npm run check                                    # = BASE_URL=http://localhost:3000 node autograder/check.mjs
   ```
3. A cada `git push`, o **GitHub Actions** roda o autograder e mostra a nota na aba **Actions**
   (resumo do job). O `autograder/check.mjs` é **aberto** — leia para saber exatamente o que se espera.

## O que implementar (em `src/`)

```
src/
├── controllers/   # traduz HTTP ↔ service (sem regra de negócio)
├── services/      # TODA a regra de negócio
├── repositories/  # só acesso a dados
├── database/      # persistência SIMULADA em memória (sem banco real, sem ORM)
├── routes/        # composição das dependências (injeção) + monta em /api
└── utils/
```

- **Regra de negócio só no Service.** Injeção de dependência no **composition root** (`src/routes`).
- O `server.js` só configura o app (já traz o `GET /api/health` exigido — não remova).

## API de Entregas

Base URL: `http://localhost:3000/api`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está disponível. |
| `POST` | `/entregas` | Cria uma entrega. |
| `GET` | `/entregas` | Lista entregas; aceita o filtro `?status=`. |
| `GET` | `/entregas/:id` | Busca uma entrega pelo ID. |
| `PATCH` | `/entregas/:id/avancar` | Avança o status da entrega. |
| `PATCH` | `/entregas/:id/cancelar` | Cancela uma entrega. |
| `GET` | `/entregas/:id/historico` | Exibe os eventos do histórico. |
| `PATCH` | `/entregas/:id/atribuir` | Atribui um motorista (`{ motoristaId }`) a uma entrega `CRIADA`. |

## API de Motoristas

| Método | Rota | Corpo | Sucesso | Erros |
|---|---|---|---|---|
| `POST` | `/motoristas` | `{ nome, cpf, placaVeiculo? }` | `201` motorista (`status: ATIVO`) | `400` campos · `409` CPF duplicado |
| `GET` | `/motoristas` | — | `200` array | — |
| `GET` | `/motoristas/:id` | — | `200` motorista | `404` |
| `GET` | `/motoristas/:id/entregas` | — | `200` só as entregas do motorista; aceita `?status=` | `404` |

### Exemplos com curl

Com o servidor em execução (`npm start`), execute os comandos abaixo em outro terminal.

```bash
# Health check
curl http://localhost:3000/api/health

# Criar entrega
curl -X POST http://localhost:3000/api/entregas \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Caixa de livro",
    "origem": "Maceio",
    "destino": "Arapiraca"
  }'

# Listar todas as entregas
curl http://localhost:3000/api/entregas

# Listar somente entregas com aquele status (CRIADA, EM_TRANSITO, ENTREGUE, CANCELADA)
curl "http://localhost:3000/api/entregas?status=STATUS"

# Buscar uma entrega
curl http://localhost:3000/api/entregas/<id>

# Avançar o status: CRIADA -> EM_TRANSITO -> ENTREGUE
curl -X PATCH http://localhost:3000/api/entregas/<id>/avancar

# Cancelar uma entrega que ainda não foi entregue
curl -X PATCH http://localhost:3000/api/entregas/<id>/cancelar

# Consultar o histórico de uma entrega
curl http://localhost:3000/api/entregas/<id>/historico

# Cadastrar motorista (placaVeiculo é opcional)
curl -X POST http://localhost:3000/api/motoristas \
  -H "Content-Type: application/json" \
  -d '{ "nome": "Maria", "cpf": "123.456.789-00", "placaVeiculo": "ABC1D23" }'

# Listar / buscar motoristas
curl http://localhost:3000/api/motoristas
curl http://localhost:3000/api/motoristas/<id>

# Atribuir motorista a uma entrega CRIADA
curl -X PATCH http://localhost:3000/api/entregas/<id>/atribuir \
  -H "Content-Type: application/json" \
  -d '{ "motoristaId": <motoristaId> }'

# Entregas de um motorista (filtro de status opcional)
curl http://localhost:3000/api/motoristas/<id>/entregas
curl "http://localhost:3000/api/motoristas/<id>/entregas?status=CRIADA"
```

### Respostas de erro

Todas as respostas de erro seguem o formato:

```json
{ "erro": "mensagem" }
```

| Status | Situação |
|---|---|
| `400` | Entrada inválida, como origem igual ao destino ou campos ausentes. |
| `404` | Entrega ou motorista não encontrado. |
| `409` | Já existe uma entrega ativa com os mesmos dados, ou CPF já cadastrado. |
| `422` | Transição/cancelamento inválido, ou atribuição a entrega não `CRIADA` / motorista `INATIVO`. |

## Contratos de Repository e composição das dependências

Cada repository documenta seu contrato em JSDoc (`src/repositories/`). Os services chamam
**apenas** esses métodos, então qualquer implementação que os respeite (memória, banco ou Mock)
pode ser injetada:

```
EntregasRepository                       MotoristasRepository
  listarTodos(filtros?) → Entrega[]        listarTodos()     → Motorista[]
  buscarPorId(id)       → Entrega | null   buscarPorId(id)   → Motorista | null
  criar(dados)          → Entrega          buscarPorCpf(cpf) → Motorista | null
  atualizar(id, dados)  → Entrega | null   criar(dados)      → Motorista
```

Todas as dependências são criadas num único ponto, o *composition root* em
`src/routes/index.js`; nenhum service ou controller faz `new` de repository:

```
src/routes/index.js  (composition root)

  database             = new Database()
     ├──► entregasRepository   = new EntregasRepository(database)
     └──► motoristasRepository = new MotoristasRepository(database)

  entregasService   = new EntregasService(entregasRepository, motoristasRepository)
  motoristasService = new MotoristasService(motoristasRepository, entregasRepository)

  entregasController   = new EntregasController(entregasService)     ──► /api/entregas    (entregas.routes.js)
  motoristasController = new MotoristasController(motoristasService) ──► /api/motoristas  (motoristas.routes.js)

Fluxo de uma requisição:
  Router ──► Controller ──► Service ──► Repository (contrato) ──► Database
```

A regra "motorista `INATIVO` não pode ser atribuído" fica no `EntregasService`, pois é uma
regra da atribuição.

### Verificação automática

Com o servidor em execução, rode o autograder em outro terminal:

```bash
npm run check
```

## Duas etapas (ver os enunciados completos)

- **Atividade 05 — Entregas em camadas:** CRUD de `/api/entregas`, ciclo de status
  (`CRIADA → EM_TRANSITO → ENTREGUE`/`CANCELADA`), histórico. Meta: checagens de **Entregas** verdes.
- **Atividade 06 — Motoristas + Contratos + DI:** `/api/motoristas`, atribuição de motorista,
  contratos de repository (JSDoc) e composição num ponto único. Meta: **122/122**.

> O critério de **inversão de dependência** é verificado pelo professor **trocando o repository por
> um Mock** que respeita o contrato — programe contra o contrato desde o início.

## Contrato (resumo)

- Base `/api` · JSON · erro `{ "erro": "..." }` · `GET /api/health` → `{ "status": "ok" }`.
- Status: `201` criar · `400` entrada inválida · `404` não encontrado · `409` unicidade
  (duplicata/CPF) · `422` regra de estado (transição/atribuição inválida).
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.

Faça **um commit por avanço** (Conventional Commits, ex.: `feat(entregas): valida origem ≠ destino`).
Bom trabalho! 🚀
