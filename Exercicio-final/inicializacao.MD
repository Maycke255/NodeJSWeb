# Inicialização de Projetos TS/JS (Back-end + Front-end)

> Guia pessoal de consulta para começar um projeto full stack com **Node.js + Express + TypeScript** no back-end
> e **Vite + React + TypeScript** no front-end.

**V - Beta 0.3**

---

## Índice

0. [Antes de começar (pré-requisitos)](#0---antes-de-começar)
1. [Estrutura de pastas](#1---estrutura-de-pastas)
2. [Back-end: instalação](#2---back-end-instalação)
3. [Back-end: package.json e scripts](#3---back-end-packagejson-e-scripts)
4. [Back-end: tsconfig.json](#4---back-end-tsconfigjson)
5. [Back-end: primeiro servidor](#5---back-end-primeiro-servidor)
6. [Variáveis de ambiente (.env)](#6---variáveis-de-ambiente-env)
7. [Organização do código (camadas)](#7---organização-do-código-camadas)
8. [Validação de dados com Zod](#8---validação-de-dados-com-zod)
9. [Tratamento de erros (middlewares e o `next`)](#9---tratamento-de-erros-middlewares-e-o-next)
10. [Segurança básica](#10---segurança-básica)
11. [Front-end com Vite](#11---front-end-com-vite)
12. [Ligando front e back (CORS e proxy)](#12---ligando-front-e-back-cors-e-proxy)
13. [Qualidade de código (lint, format, testes)](#13---qualidade-de-código)
14. [Git](#14---git)
15. [Checklist final](#15---checklist-final)

---

## 0 - Antes de começar

- **Node.js**: use uma versão **LTS** (versão par: 20, 22, 24...). Veja com `node -v`.
  - Dica: use o **nvm** para trocar de versão facilmente entre projetos (`nvm install --lts`, `nvm use 24`).
- **npm**: vem junto com o Node. Veja com `npm -v`.
- **Git**: inicialize o repositório logo no começo (`git init`) e crie o `.gitignore` **antes** do primeiro commit.

### Sobre os comandos do npm (cuidado com os traços!)

Opções longas usam **dois traços** (`--`), opções curtas usam **um traço** (`-`):

| Forma longa       | Forma curta | O que faz                                                   |
| ----------------- | ----------- | ----------------------------------------------------------- |
| `--save`          | (padrão)    | Dependência de produção. Desde o npm 5 já é o padrão, não precisa escrever. |
| `--save-dev`      | `-D`        | Dependência só de desenvolvimento (não vai para produção).  |
| `--yes`           | `-y`        | Aceita todas as perguntas com o valor padrão.               |

> Errado: `npm i -save express` / Certo: `npm i express`
> Errado: `npm i -save-dev typescript` / Certo: `npm i -D typescript`

### Dependência normal x dependência de desenvolvimento

- **dependencies** → o código **precisa** dela para rodar em produção (ex: `express`, `zod`, `cors`).
- **devDependencies** → só serve enquanto você desenvolve/compila (ex: `typescript`, `tsx`, `@types/*`, eslint, vitest).
- Regra prática: *"se eu apagar isso, o `node dist/server.js` ainda funciona?"* Se sim, é dev. Se não, é dependência normal.

---

## 1 - Estrutura de pastas

Separar front e back em pastas próprias, cada uma com seu `package.json`, deixa tudo mais organizado:

```
meu-projeto/
├── backend/
│   ├── src/
│   │   ├── server.ts          # sobe o servidor (app.listen)
│   │   ├── app.ts             # cria e configura o express (middlewares, rotas)
│   │   ├── routes/            # define as URLs e liga cada uma a um controller
│   │   ├── controllers/       # recebe req/res, chama o service, responde
│   │   ├── services/          # regras de negócio
│   │   ├── models/            # tipos/acesso a dados
│   │   ├── middlewares/       # funções que rodam antes das rotas (auth, erros...)
│   │   └── schemas/           # validações com zod
│   ├── dist/                  # JS compilado (gerado pelo tsc, NÃO vai pro git)
│   ├── .env                   # variáveis secretas (NÃO vai pro git)
│   ├── .env.example           # modelo do .env, sem valores secretos (VAI pro git)
│   ├── package.json
│   └── tsconfig.json
├── frontend/                  # criado pelo Vite (ver seção 11)
├── .gitignore
└── README.md
```

> Por que separar `app.ts` de `server.ts`? Porque nos **testes** você importa só o `app` sem precisar
> abrir uma porta de verdade. Fica bem mais fácil testar.

---

## 2 - Back-end: instalação

```bash
mkdir backend && cd backend
npm init -y                      # cria o package.json

# Dependências de produção
npm i express zod cors helmet

# Dependências de desenvolvimento
npm i -D typescript tsx @types/node @types/express @types/cors
```

O que é cada um:

- **express** → framework do servidor HTTP (rotas, middlewares).
- **zod** → valida os dados que chegam (body, params, query). Roda em produção, então é dependência normal.
- **cors** → permite que o front (outra porta/domínio) acesse a API.
- **helmet** → adiciona cabeçalhos HTTP de segurança automaticamente.
- **typescript** → traz o `tsc`, o compilador que transforma TS em JS.
- **tsx** → roda arquivos `.ts` direto, sem compilar antes. Usado **só em desenvolvimento**.
  - Atenção: o `tsx` **não verifica tipos**, ele só remove a tipagem e executa. Erros de tipo só aparecem no editor ou rodando o `tsc`. Por isso criamos o script `typecheck` (próxima seção).
- **@types/...** → "manuais de tipagem" de bibliotecas que foram escritas em JS puro, para o TS entender elas.
  - Algumas libs já vêm com tipos embutidos (ex: zod, helmet), então não precisam de `@types`.

---

## 3 - Back-end: package.json e scripts

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch --env-file=.env src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node --env-file=.env dist/server.js"
  }
}
```

Explicando cada script (rode com `npm run <nome>`):

- **dev** → fica "ouvindo" os arquivos e reinicia o servidor a cada alteração. Também carrega o `.env`.
- **typecheck** → roda o compilador só para **checar erros de tipo**, sem gerar arquivos (`--noEmit`).
- **build** → compila tudo de `src/` (TS) para `dist/` (JS).
- **start** → roda o JS já compilado. É o que se usa em **produção**.

> Fluxo: durante o desenvolvimento usa `npm run dev`. Para publicar: `npm run build` e depois `npm start`.

### `"type": "module"` (importante!)

Define se o Node trata os arquivos `.js` como **ESM** (`import/export`, o padrão moderno) ou **CommonJS** (`require/module.exports`, o antigo).

- Use **`"type": "module"`** em projetos novos.
- Com `"type": "commonjs"` + `verbatimModuleSyntax` no tsconfig, o TS dá o erro:
  `TS1295: ECMAScript imports and exports cannot be written in a CommonJS file`.

### Imports com extensão `.js`

Com ESM + `"module": "nodenext"`, os **imports de arquivos seus** precisam da extensão **`.js`** (sim, `.js` mesmo escrevendo em `.ts`, porque é o nome que o arquivo terá depois de compilado):

```ts
import { app } from "./app.js";            // certo
import { app } from "./app";               // erro
import express from "express";             // pacotes do npm não precisam de extensão
```

---

## 4 - Back-end: tsconfig.json

Crie com `npx tsc --init` e ajuste. Uma configuração boa para back-end:

```jsonc
{
  "compilerOptions": {
    // Onde ficam os arquivos .ts e para onde vai o .js compilado
    "rootDir": "./src",
    "outDir": "./dist",

    // Como o código é gerado/resolvido (padrão moderno do Node)
    "module": "nodenext",
    "target": "esnext",

    // Quais pacotes de tipos globais carregar (o "process", "__dirname", etc. vêm do "node")
    "types": ["node"],

    // Ajudam a depurar: o erro aponta a linha do .ts e não do .js
    "sourceMap": true,

    // Regras de segurança de tipos
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Compatibilidade com ferramentas como o tsx/esbuild
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Explicando as opções mais importantes:

- **rootDir** → pasta onde está o código-fonte. **No TypeScript 6+ ela é obrigatória** quando o código não está na raiz; sem ela o `tsc` dá o erro `TS5011` e ainda gera `dist/src/server.js` em vez de `dist/server.js` (e o seu `npm start` não encontra o arquivo).
- **outDir** → pasta de saída do JS compilado.
- **types** → no TS 6+ o padrão virou `[]` (nenhum tipo global). Coloque `["node"]` para garantir os tipos do Node.
- **strict** → liga todas as checagens rígidas. **Sempre deixe ligado**, é o que faz o TS valer a pena.
- **noUncheckedIndexedAccess** → `lista[0]` passa a ser `T | undefined`, obrigando você a checar se existe.
- **exactOptionalPropertyTypes** → diferencia "propriedade ausente" de "propriedade com `undefined`". É bem rígido; se incomodar muito, pode desligar.
- **verbatimModuleSyntax** → obriga a usar `import type` quando você importa **só tipos**:
  ```ts
  import type { Request, Response } from "express";
  ```
- **include** → diz quais pastas o compilador deve olhar.

> Opções que **não** precisa no back-end: `"jsx"` (é para React) e `"declaration"`/`"declarationMap"`
> (são para quem publica uma biblioteca no npm).

---

## 5 - Back-end: primeiro servidor

**src/app.ts** → configura o express:

```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

app.use(helmet());                                  // cabeçalhos de segurança
app.use(cors({ origin: process.env.FRONTEND_URL }));// libera acesso só do seu front
app.use(express.json());                            // permite ler JSON no req.body

app.use("/api", router);                            // todas as rotas começam com /api

app.use(errorHandler);                              // SEMPRE por último
```

**src/server.ts** → só sobe o servidor:

```ts
import { app } from "./app.js";

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

**src/routes/index.ts**:

```ts
import { Router } from "express";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
```

> Dica: uma rota `/health` simples é ótima para testar rapidamente se a API está no ar.
> Dica 2: parâmetros que você não usa podem começar com `_` (ex: `_req`) para indicar isso.

---

## 6 - Variáveis de ambiente (.env)

Servem para guardar configurações que **mudam entre ambientes** (sua máquina x produção) e **segredos** (senhas, chaves de API).

**.env** (nunca vai para o git):
```
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgres://usuario:senha@localhost:5432/meubanco
```

**.env.example** (vai para o git, sem os valores secretos, serve de modelo para quem clonar o projeto):
```
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=
```

- O Node 20.6+ já lê `.env` sozinho com `--env-file=.env` (por isso está nos scripts). Não precisa mais do pacote `dotenv`.
- Lê no código com `process.env.NOME`.
- **Boa prática**: validar as variáveis com zod logo ao iniciar, assim o app quebra cedo e com uma mensagem clara se faltar alguma:

```ts
// src/env.ts
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),       // coerce: converte a string "3000" em número
  FRONTEND_URL: z.url(),
  DATABASE_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
```

Depois é só usar `env.PORT` (já tipado!) em vez de `process.env.PORT`.

---

## 7 - Organização do código (camadas)

Cada camada tem **uma responsabilidade**. Isso evita arquivos gigantes e facilita achar e corrigir as coisas.

```
Requisição → Route → (Middleware) → Controller → Service → Model/Banco
                                         ↓
Resposta   ←──────────────────────────── ┘
```

- **Route**: só diz "a URL `POST /users` chama `userController.create`".
- **Controller**: lê o `req`, chama o service, devolve o `res` com o status certo. **Não tem regra de negócio.**
- **Service**: a regra de negócio ("não pode cadastrar e-mail repetido", "calcular total do pedido").
- **Model**: acesso aos dados (banco, arquivo, array em memória).

Exemplo resumido:

```ts
// routes/user.routes.ts
userRouter.post("/", userController.create);

// controllers/user.controller.ts
import type { Request, Response } from "express";
export async function create(req: Request, res: Response) {
  const data = createUserSchema.parse(req.body);   // valida
  const user = await userService.create(data);     // regra de negócio
  res.status(201).json(user);                      // responde
}
```

### Status HTTP mais usados

| Código | Quando usar                                   |
| ------ | --------------------------------------------- |
| 200    | OK (deu certo, com resposta)                  |
| 201    | Created (algo foi criado, ex: POST)           |
| 204    | No Content (deu certo, sem resposta, ex: DELETE) |
| 400    | Bad Request (dados inválidos enviados)        |
| 401    | Unauthorized (não está logado)                |
| 403    | Forbidden (está logado mas não tem permissão) |
| 404    | Not Found (recurso não existe)                |
| 409    | Conflict (ex: e-mail já cadastrado)           |
| 500    | Internal Server Error (erro no servidor)      |

---

## 8 - Validação de dados com Zod

**Nunca confie nos dados que vêm do cliente.** O TypeScript só checa tipos **enquanto você programa**; quando o
servidor está rodando, o `req.body` pode ter qualquer coisa. O zod valida **em tempo de execução**.

```ts
// schemas/user.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.email("E-mail inválido"),
  age: z.number().int().positive().optional(),
});

// Gera o tipo TS automaticamente a partir do schema (não precisa escrever duas vezes!)
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

- `schema.parse(dados)` → retorna os dados validados ou **lança um erro**.
- `schema.safeParse(dados)` → não lança erro; retorna `{ success: true, data }` ou `{ success: false, error }`.

---

## 9 - Tratamento de erros (middlewares e o `next`)

### 9.1 - O que é um middleware?

Um middleware é **uma função que fica no meio do caminho** entre a requisição chegar e a resposta sair.
O Express executa os middlewares **em fila, na ordem do `app.use()` / das rotas**, como uma linha de montagem:

```
Requisição → [helmet] → [cors] → [express.json] → [sua rota] → ... → Resposta
```

Todo middleware recebe 3 coisas:

```ts
(req, res, next) => { ... }
```

- **req** → a requisição (body, params, query, headers...).
- **res** → a resposta (`res.status()`, `res.json()`...).
- **next** → uma função que significa **"passa para o próximo da fila"**.

Cada middleware precisa fazer **uma** destas coisas, senão a requisição fica "pendurada" e o cliente espera para sempre:

1. **Responder** → `res.json(...)` / `res.send(...)` (a fila termina aqui), **ou**
2. **Chamar `next()`** → passa para o próximo middleware/rota, **ou**
3. **Chamar `next(erro)`** → pula direto para o **middleware de erro** (próxima seção).

### 9.2 - `next()` x `next(erro)` (a parte mais importante!)

| Chamada         | O que o Express faz                                                              |
| --------------- | -------------------------------------------------------------------------------- |
| `next()`        | Vai para o **próximo middleware normal** da fila.                                |
| `next(erro)`    | **Pula todos os middlewares normais** e vai direto para o **middleware de erro**. |

Ou seja: **passar qualquer coisa dentro do `next(...)` diz ao Express "deu erro"**. Ele para a fila normal e
procura o primeiro middleware de erro registrado.

```
                 next()             next()
[middleware A] ─────────▶ [rota] ─────────▶ [próximo]
       │
       │ next(new AppError(401, "Faça login"))
       │
       └──────── pula tudo ────────▶ [middleware de ERRO] → responde 401
```

### 9.3 - O middleware de erro (4 parâmetros)

O Express sabe que um middleware é **de erro** quando ele tem **exatamente 4 parâmetros**:

```ts
(err, req, res, next) => { ... }
```

- O **primeiro** parâmetro (`err`) é aquilo que você passou no `next(err)` ou o erro que foi lançado com `throw`.
- Precisa ter os **4**, mesmo que você não use o `next`. Com 3 parâmetros o Express acha que é um middleware
  normal e **nunca** manda erro para ele.
- Precisa ser registrado **por último**, depois de todas as rotas (a fila é lida de cima para baixo).

### 9.4 - Criando a classe de erro (status + message)

Para que o middleware de erro saiba **qual status** responder, criamos uma classe de erro própria que guarda
o `status` (number) e a `message` (texto):

```ts
// src/errors/AppError.ts
export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);        // o Error do JS já guarda a message
    this.status = status;  // nós acrescentamos o status HTTP
    this.name = "AppError";
  }
}
```

- `extends Error` → o `AppError` **é** um erro de verdade (dá para usar `throw`, tem `message` e `stack`).
- `super(message)` → chama o construtor do `Error` original, que guarda a mensagem.
- Uso: `new AppError(404, "Usuário não encontrado")`.

### 9.5 - O middleware de erro completo

```ts
// src/middlewares/errorHandler.ts
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // 1. Erro que NÓS criamos de propósito (sabemos o status e a mensagem)
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }

  // 2. Erro de validação do zod (dados inválidos enviados pelo cliente)
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Dados inválidos", issues: err.issues });
  }

  // 3. Qualquer outro erro = algo inesperado (bug, banco caiu...)
  console.error(err);                                        // o detalhe fica só no terminal do servidor
  return res.status(500).json({ message: "Erro interno do servidor" });
};
```

> Por que não mandar o erro real no caso 3? Porque ele pode conter informações internas (caminho de pastas,
> SQL, senhas de conexão). O cliente só precisa saber que deu erro; o detalhe é para você, no log.

`ErrorRequestHandler` é o tipo do Express para middleware de erro. Com ele você não precisa tipar
`err`, `req`, `res` e `next` um por um.

### 9.6 - Registrando no app (a ordem importa!)

```ts
// src/app.ts
import express from "express";
import { router } from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

app.use(express.json());   // 1º middlewares normais
app.use("/api", router);   // 2º rotas
app.use(notFound);         // 3º "nenhuma rota respondeu" → 404
app.use(errorHandler);     // 4º SEMPRE o último
```

O `notFound` pega as URLs que não existem. Se nenhuma rota respondeu, a requisição chega até ele:

```ts
// src/middlewares/notFound.ts
import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Rota ${req.method} ${req.originalUrl} não encontrada`));
};
```

### 9.7 - E nos controllers, services e models? Quem usa o `next`?

Esta é a parte que mais confunde. A regra é:

- **Model e service NÃO recebem `next`** (eles nem sabem que o Express existe). Quando algo dá errado, eles
  usam **`throw new AppError(...)`**.
- **Controller** é quem conversa com o Express, então é ele que tem `next`. Mas no **Express 5** ele quase
  nunca precisa chamar: se o controller for `async` e algum `throw` acontecer lá dentro (nele ou no service/model
  que ele chamou), **o Express pega o erro e faz o `next(erro)` sozinho**.

O caminho do erro, de baixo para cima:

```
model:       throw new AppError(404, "Usuário não encontrado")
               ↓  (o throw "sobe" para quem chamou)
service:     (não trata, deixa subir)
               ↓
controller:  async → o Express 5 pega o erro e chama next(erro) por você
               ↓
errorHandler: res.status(404).json({ message: "Usuário não encontrado" })
```

Exemplo completo:

```ts
// models/user.model.ts
const users = [{ id: 1, name: "Ana", email: "ana@email.com" }];

export function findById(id: number) {
  return users.find((u) => u.id === id);   // retorna o usuário ou undefined
}

export function findByEmail(email: string) {
  return users.find((u) => u.email === email);
}
```

```ts
// services/user.service.ts
import { AppError } from "../errors/AppError.js";
import * as userModel from "../models/user.model.js";

export function getById(id: number) {
  const user = userModel.findById(id);
  if (!user) {
    throw new AppError(404, "Usuário não encontrado");   // a regra de negócio decide o erro
  }
  return user;
}

export function checkEmailFree(email: string) {
  if (userModel.findByEmail(email)) {
    throw new AppError(409, "E-mail já cadastrado");
  }
}
```

```ts
// controllers/user.controller.ts
import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = userService.getById(id);   // se der throw aqui, o Express 5 manda pro errorHandler
  res.json(user);                         // essa linha só roda se NÃO deu erro
}
```

Repare que o controller **não tem nenhum `try/catch` nem `next`**: ele só cuida do "caminho feliz".

### 9.8 - Quando você PRECISA chamar `next(erro)` na mão

**a) Em middlewares que verificam algo antes da rota** (ex: autenticação). Aqui é comum usar `next` diretamente:

```ts
// middlewares/auth.ts
import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

export const auth: RequestHandler = (req, _res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new AppError(401, "Token não informado"));   // erro → vai pro errorHandler
  }
  next();                                                    // tudo certo → segue para a rota
};
```

> Use **`return next(...)`** para a função parar ali. Sem o `return`, o código continua e chama o `next()`
> de baixo também (dois "próximos" = bug).

**b) Em callbacks antigos** (funções que não usam Promise/async, ex: `fs.readFile` com callback). O Express
não consegue "ver" um erro que acontece lá dentro, então você precisa entregar ele com `next(err)`:

```ts
import fs from "node:fs";

router.get("/arquivo", (req, res, next) => {
  fs.readFile("dados.txt", "utf8", (err, conteudo) => {
    if (err) return next(err);   // sem isso, o servidor quebra ou a requisição fica pendurada
    res.send(conteudo);
  });
});
```

> Dica: prefira a versão com Promise (`import fs from "node:fs/promises"` + `await`), aí volta a valer o
> "é só dar throw".

**c) No Express 4** (projetos antigos). Ele **não** pega erros de funções `async` sozinho, então todo
controller async precisa de `try/catch` + `next(err)`:

```ts
// Só necessário no Express 4!
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = userService.getById(Number(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
}
```

### 9.9 - `throw` x `next(erro)`: resumo

| Onde você está                               | O que usar                    |
| -------------------------------------------- | ----------------------------- |
| Model / Service                              | `throw new AppError(...)`     |
| Controller `async` (Express 5)               | `throw` (ou deixar subir)     |
| Middleware antes da rota (auth, permissões)  | `return next(new AppError(...))` |
| Dentro de callback (`fs.readFile`, timers)   | `return next(err)`            |
| Controller no Express 4                      | `try/catch` + `next(err)`     |

### 9.10 - Erros comuns

- **Middleware de erro com 3 parâmetros** → o Express ignora ele. Precisa ter `(err, req, res, next)`.
- **Middleware de erro registrado antes das rotas** → o erro nunca chega nele. Ele vem **por último**.
- **Esquecer o `return`** antes de `res.json()` ou `next()` → o código continua e tenta responder duas vezes,
  dando o erro **`Cannot set headers after they are sent to the client`**.
- **Não responder nem chamar `next()`** → a requisição fica "carregando" para sempre no Postman/navegador.
- **Usar `res.status(404).json(...)` espalhado em todo lugar** → funciona, mas cada lugar fica com um formato
  de resposta diferente. Centralizando no `errorHandler`, todo erro da API sai no mesmo formato
  (`{ message: "..." }`) e o front sabe sempre como ler.

---

## 10 - Segurança básica

- **helmet** → sempre. Uma linha (`app.use(helmet())`) e já protege contra vários ataques comuns.
- **cors** → libere **só** a origem do seu front, nunca deixe `*` em produção se houver login.
- **Senhas** → nunca salve em texto puro. Use `bcrypt` ou `argon2` para gerar o hash.
- **Segredos** → só no `.env`. Se um segredo for parar no git, considere ele **vazado** e troque.
- **Validação** → todo dado de entrada passa pelo zod (seção 8).
- **Limite de requisições** → em rotas sensíveis (login), use `express-rate-limit` para evitar força bruta.
- **Dependências** → rode `npm audit` de vez em quando para ver pacotes com falhas conhecidas.

---

## 11 - Front-end com Vite

O **Vite** cria e roda projetos de front-end (React, Vue, etc.) de forma muito rápida, já com TypeScript configurado.

Na pasta raiz do projeto:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev        # abre em http://localhost:5173
```

- Outros templates: `vanilla-ts` (TS puro, sem framework), `vue-ts`, `svelte-ts`.
- Variáveis de ambiente no Vite precisam começar com **`VITE_`** (ex: `VITE_API_URL`) e são lidas com
  `import.meta.env.VITE_API_URL`.
  - **Atenção**: tudo que está no front é **público** (qualquer um vê no navegador). Nunca coloque segredos aqui.
- `npm run build` gera a pasta `frontend/dist` com HTML/CSS/JS prontos para publicar.

---

## 12 - Ligando front e back (CORS e proxy)

Front (porta 5173) e back (porta 3000) estão em **origens diferentes**, então o navegador bloqueia as
requisições por padrão (é o famoso erro de **CORS**). Duas soluções, pode usar as duas juntas:

**a) Proxy do Vite (mais prático no desenvolvimento)** → em `frontend/vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",   // tudo que começar com /api vai para o back
    },
  },
});
```

Assim no front você faz só `fetch("/api/health")`, sem escrever o endereço do servidor.

**b) CORS no back** → o `app.use(cors({ origin: process.env.FRONTEND_URL }))` da seção 5. Necessário quando
front e back forem publicados em domínios diferentes.

Exemplo de chamada no front:

```ts
type Health = { status: string };

const res = await fetch("/api/health");
if (!res.ok) throw new Error("Falha ao buscar dados");
const data: Health = await res.json();
```

> Dica: tipos usados pelos dois lados (ex: `User`) podem ficar numa pasta `shared/` para não duplicar.

---

## 13 - Qualidade de código

### Lint e formatação

- **ESLint** → encontra erros e más práticas no código. `npm init @eslint/config@latest`
- **Prettier** → formata o código automaticamente (aspas, espaços, ponto e vírgula).
  `npm i -D prettier` e crie um `.prettierrc`.
- Alternativa "tudo em um": **Biome** (`npm i -D @biomejs/biome`), faz lint + formatação e é bem mais rápido.
- No VS Code, ative **"Format on Save"** para formatar ao salvar.

### Testes

- **Vitest** → roda os testes (rápido e já entende TS). `npm i -D vitest`
- **Supertest** → testa as rotas do express sem subir o servidor. `npm i -D supertest @types/supertest`

```ts
// src/app.test.ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./app.js";

describe("GET /api/health", () => {
  it("retorna status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
```

Script: `"test": "vitest"`.

---

## 14 - Git

**.gitignore** mínimo (na raiz do projeto):

```
node_modules/
dist/
.env
*.log
.DS_Store
coverage/
```

> Atenção: o `.env` precisa estar no `.gitignore` **antes** do primeiro commit. Se ele já foi commitado,
> não basta adicionar depois: use `git rm --cached .env` e troque os segredos.

**Mensagens de commit** (padrão *Conventional Commits*), deixam o histórico fácil de ler:

- `feat:` nova funcionalidade → `feat: cria rota de cadastro de usuário`
- `fix:` correção de bug → `fix: corrige validação de e-mail`
- `chore:` configuração/manutenção → `chore: instala dependências`
- `refactor:` melhora o código sem mudar o comportamento
- `docs:` documentação
- `test:` testes

Commits **pequenos e frequentes** são melhores que um commit gigante no final.

**package-lock.json** → **sempre** vai para o git. Ele garante que todos instalem exatamente as mesmas versões.
Para instalar a partir dele (ex: depois de clonar), use `npm ci`.

---

## 15 - Checklist final

- [ ] `git init` + `.gitignore` (com `node_modules`, `dist`, `.env`)
- [ ] `npm init -y` e `"type": "module"` no package.json
- [ ] Dependências instaladas no lugar certo (produção x `-D`)
- [ ] `tsconfig.json` com `rootDir`, `outDir`, `types: ["node"]` e `strict: true`
- [ ] Scripts `dev`, `typecheck`, `build`, `start`
- [ ] `.env` + `.env.example` + validação das variáveis com zod
- [ ] `app.ts` separado de `server.ts`
- [ ] Pastas por camada (routes, controllers, services...)
- [ ] Classe `AppError(status, message)` + `notFound` + middleware de erro único, registrado por último
- [ ] `helmet` e `cors` configurados
- [ ] Front criado com Vite e proxy para `/api`
- [ ] ESLint/Prettier (ou Biome) configurados
- [ ] Pelo menos um teste rodando
- [ ] `README.md` explicando como instalar e rodar o projeto
