# Banco de Dados: PostgreSQL + Prisma

> Guia pessoal de consulta para usar **PostgreSQL** com o **Prisma ORM** em projetos Node.js + Express + TypeScript.
> Complementa o [inicializacao.MD](./inicializacao.MD).

**V - Beta 0.1** · Testado com **Prisma 7.10.1**, Node 24 e TypeScript 7

---

## Índice

0. [Conceitos básicos](#0---conceitos-básicos)
1. [Subindo um PostgreSQL](#1---subindo-um-postgresql)
2. [Instalando o Prisma no projeto](#2---instalando-o-prisma-no-projeto)
3. [Os arquivos do Prisma](#3---os-arquivos-do-prisma)
4. [O schema.prisma em detalhes](#4---o-schemaprisma-em-detalhes)
5. [Relacionamentos entre tabelas](#5---relacionamentos-entre-tabelas)
6. [Migrations](#6---migrations)
7. [O Prisma Client (conexão)](#7---o-prisma-client-conexão)
8. [Métodos (CRUD e consultas)](#8---métodos-crud-e-consultas)
9. [Integrando com as camadas (model, service, controller)](#9---integrando-com-as-camadas)
10. [Tratando erros do Prisma](#10---tratando-erros-do-prisma)
11. [Seed (dados iniciais)](#11---seed-dados-iniciais)
12. [Prisma Studio](#12---prisma-studio)
13. [Scripts no package.json](#13---scripts-no-packagejson)
14. [Erros comuns](#14---erros-comuns)
15. [Resumo do dia a dia + checklist](#15---resumo-do-dia-a-dia--checklist)
16. [Extra: comandos do psql](#16---extra-comandos-do-psql)

---

## 0 - Conceitos básicos

### Banco de dados relacional (PostgreSQL)

O **PostgreSQL** (ou "Postgres") é um banco de dados **relacional**: os dados ficam em **tabelas**, parecidas com planilhas.

| Termo              | O que é                                                    | Exemplo                       |
| ------------------ | ---------------------------------------------------------- | ----------------------------- |
| **Tabela**         | Um "tipo" de dado guardado                                 | `users`, `posts`              |
| **Coluna**         | Um campo da tabela                                         | `name`, `email`               |
| **Linha/registro** | Um item salvo                                              | O usuário "Ana"               |
| **Primary Key (PK)** | Coluna que identifica cada linha de forma única          | `id`                          |
| **Foreign Key (FK)** | Coluna que aponta para a PK de outra tabela (relacionamento) | `posts.author_id → users.id` |
| **SQL**            | A linguagem usada para conversar com o banco               | `SELECT * FROM users;`        |

### ORM (Prisma)

Um **ORM** (Object-Relational Mapping) deixa você usar o banco **com código TypeScript em vez de escrever SQL**:

```ts
// Sem ORM (SQL puro)
SELECT * FROM users WHERE email = 'ana@email.com';

// Com Prisma
await prisma.user.findUnique({ where: { email: "ana@email.com" } });
```

Vantagens: **autocomplete**, **tipagem automática** (o TS sabe exatamente quais campos existem) e proteção contra **SQL Injection**.

### As 4 peças do Prisma

| Peça               | O que faz                                                                     |
| ------------------ | ----------------------------------------------------------------------------- |
| **schema.prisma**  | Arquivo onde você **desenha** as tabelas (os "models").                       |
| **Prisma CLI**     | Comandos no terminal (`npx prisma ...`) para criar migrations, gerar o client etc. |
| **Migrations**     | Arquivos `.sql` gerados a partir do schema, que **criam/alteram as tabelas** no banco. |
| **Prisma Client**  | O código gerado que você **importa** no projeto para fazer as consultas.       |

O fluxo é sempre:

```
Edito o schema.prisma → npx prisma migrate dev → npx prisma generate → uso o prisma no código
     (desenho)            (altera o banco)       (atualiza os tipos)
```

---

## 1 - Subindo um PostgreSQL

Você precisa de um Postgres rodando para o Prisma se conectar. Escolha **uma** das opções:

### Opção A: `prisma dev` (a mais fácil, para estudar/testar)

O próprio Prisma sobe um Postgres local, sem instalar nada:

```bash
npx prisma dev            # sobe o banco e fica rodando no terminal
npx prisma dev --detach   # sobe em segundo plano
npx prisma dev ls         # lista os bancos criados
npx prisma dev stop       # para o banco
```

Ele mostra no terminal uma URL do tipo `postgres://postgres:postgres@localhost:51214/template1?sslmode=disable`.
Copie essa URL (a que começa com `postgres://`) para o `DATABASE_URL` do `.env`.

### Opção B: Docker (a mais usada em projetos reais)

Crie um `docker-compose.yml` na raiz do projeto:

```yaml
services:
  db:
    image: postgres:17
    container_name: meu-projeto-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: meu_usuario
      POSTGRES_PASSWORD: minha_senha
      POSTGRES_DB: meu_banco
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data   # os dados continuam salvos mesmo se o container parar

volumes:
  pgdata:
```

```bash
docker compose up -d     # sobe o banco em segundo plano
docker compose down      # para o banco (os dados ficam salvos no volume)
```

`.env`: `DATABASE_URL="postgresql://meu_usuario:minha_senha@localhost:5432/meu_banco?schema=public"`

### Opção C: Instalar no Linux (Ubuntu)

```bash
sudo apt update
sudo apt install postgresql
sudo -u postgres psql          # entra no terminal do Postgres como administrador
```

Dentro do `psql`, crie um usuário e um banco para o projeto:

```sql
CREATE USER meu_usuario WITH PASSWORD 'minha_senha' CREATEDB;
CREATE DATABASE meu_banco OWNER meu_usuario;
\q
```

> **Por que o `CREATEDB`?** O `prisma migrate dev` cria um banco temporário (o *shadow database*) para
> conferir as migrations. Sem essa permissão ele dá erro de permissão.

### Opção D: Na nuvem (para publicar o projeto)

Serviços com plano grátis: **Neon**, **Supabase**, **Prisma Postgres** (`npx create-db`), **Railway**, **Render**.
Eles te dão uma `DATABASE_URL` pronta.

### Formato da URL de conexão

```
postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public
```

- **PORTA** padrão do Postgres: `5432`.
- **schema=public** → o "schema" padrão do Postgres (uma pasta onde ficam as tabelas).
- Se a senha tiver caracteres especiais (`@`, `#`, `/`...), eles precisam ser **codificados** (ex: `@` vira `%40`).

---

## 2 - Instalando o Prisma no projeto

### Onde instalar? Junto do `package.json` do servidor

O Prisma é **dependência do servidor**: quem conversa com o banco é a API, nunca o navegador. Então ele vai
no **mesmo `package.json` do express**, onde quer que ele esteja (ver seção 1 do `inicializacao.MD`):

| Estrutura do projeto                                     | Onde fica o `package.json` do servidor | Onde instalar o Prisma |
| -------------------------------------------------------- | -------------------------------------- | ---------------------- |
| **A)** Um projeto só (só API, ou front HTML/CSS/JS servido pelo express) | Na **raiz**        | Na **raiz**            |
| **B)** Front com Vite/React em `frontend/` + `backend/`, cada um com seu `package.json` | Em `backend/` | Em **`backend/`** (`cd backend` antes) |

- A pasta `prisma/`, o `prisma.config.ts` e o `.env` (com a `DATABASE_URL`) ficam **ao lado desse `package.json`**.
- Os comandos `npm i ...` e `npx prisma ...` são rodados **nessa mesma pasta**. Se rodar em outra, aparece
  `Could not find Prisma Schema` ou um `node_modules` novo onde não devia.
- No formato B, o `package.json` do `frontend/` **nunca** recebe o Prisma.

### Comandos

```bash
# (formato B: cd backend antes)

# Dependências de produção (o app precisa delas rodando)
npm i @prisma/client@7 @prisma/adapter-pg@7 pg

# Dependências de desenvolvimento
npm i -D prisma@7 dotenv

# Cria os arquivos iniciais já configurados para PostgreSQL
npx prisma init --datasource-provider postgresql
```

O que é cada pacote:

- **prisma** → a CLI (os comandos `npx prisma ...`). Só usada em desenvolvimento/deploy.
- **@prisma/client** → a biblioteca base do client que você usa no código.
- **@prisma/adapter-pg** + **pg** → o "adaptador" que faz o Prisma conversar com o Postgres usando o driver `pg`.
  **No Prisma 7 o adapter é obrigatório.**
- **dotenv** → a CLI do Prisma **não lê o `.env` sozinha**; o `prisma.config.ts` usa o dotenv para carregar ele.

> ⚠️ **Sempre use a mesma versão principal** em `prisma`, `@prisma/client` e `@prisma/adapter-pg`
> (por isso o `@7` nos comandos). Em out/2026, um simples `npm i -D prisma` instala uma versão **8 ainda em teste (rc)**,
> enquanto o `@prisma/client` continua na 7. Versões diferentes = erros estranhos.

> 💡 O `prisma init` também pode criar pastas de "skills" para assistentes de IA (`.claude/`, `.agents/`...).
> Se não quiser, use `npx prisma init --datasource-provider postgresql --skills=none`.

---

## 3 - Os arquivos do Prisma

Depois do `init`, a estrutura fica assim:

```
backend/
├── prisma/
│   ├── schema.prisma          # desenho das tabelas
│   ├── migrations/            # histórico de alterações do banco (VAI pro git)
│   └── seed.ts                # (opcional) dados iniciais
├── src/
│   ├── generated/prisma/      # client gerado pelo Prisma (NÃO vai pro git, é recriado)
│   └── lib/prisma.ts          # conexão única com o banco (seção 7)
├── prisma.config.ts           # configuração da CLI do Prisma
└── .env                       # DATABASE_URL (NÃO vai pro git)
```

### prisma.config.ts

Diz para a CLI **onde está o schema**, **onde ficam as migrations** e **qual é a URL do banco**:

```ts
import "dotenv/config";                       // carrega o .env (a CLI não faz isso sozinha)
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --env-file=.env prisma/seed.ts", // comando do seed (seção 11)
  },
  datasource: {
    url: env("DATABASE_URL"),                 // env() dá erro claro se a variável não existir
  },
});
```

> Se o `init` criar o arquivo com outro nome (ex: `prisma7.config.ts`), renomeie para **`prisma.config.ts`**.
> A CLI só procura esse nome. Com outro nome ela ignora o arquivo e não acha a `DATABASE_URL`.
> Se não quiser renomear, passe o caminho em todo comando: `npx prisma migrate dev --config prisma7.config.ts`.

### .env

```
DATABASE_URL="postgresql://meu_usuario:minha_senha@localhost:5432/meu_banco?schema=public"
```

E no `.env.example` (vai para o git): `DATABASE_URL=`

### .gitignore

Adicione:

```
.env
src/generated/
```

A pasta `generated` é recriada com `npx prisma generate`, então não precisa ir para o git.
**A pasta `prisma/migrations` VAI para o git**, porque é o histórico do banco.

### tsconfig.json

Garanta que o `"include"` aponte para a pasta do código, para o `tsc` não tentar compilar o `prisma.config.ts`
e o `seed.ts` (que estão fora do `rootDir`):

```jsonc
{
  "compilerOptions": { "rootDir": "./src", "outDir": "./dist", /* ... */ },
  "include": ["src"]
}
```

---

## 4 - O schema.prisma em detalhes

### Os dois blocos de configuração

```prisma
generator client {
  provider            = "prisma-client"            // o gerador novo do Prisma 7
  output              = "../src/generated/prisma"  // ONDE o client vai ser gerado (obrigatório no Prisma 7)
  importFileExtension = "js"                       // ver o aviso abaixo
}

datasource db {
  provider = "postgresql"                          // qual banco (a URL fica no prisma.config.ts)
}
```

- **output** → caminho relativo ao `schema.prisma`. No Prisma 7 o client não vai mais para o `node_modules`.
  O `"../src/generated/prisma"` sai da pasta `prisma/` e entra na `src/` que está ao lado dela. Se o seu código
  estiver em outra pasta (ex: `backend/` no formato A), ajuste: `"../backend/generated/prisma"`.
- **importFileExtension = "js"** → ⚠️ **importante para projetos que usam `tsc` + `node dist/...`**. Sem essa
  linha, o código gerado importa arquivos com `.ts` no final; funciona no `tsx` (dev), mas depois do
  `npm run build` o `node` **quebra** com `ERR_MODULE_NOT_FOUND ... enums.ts`.

### Model = tabela

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  bio       String?                          // ? = opcional (pode ser NULL)
  role      Role     @default(USER)
  posts     Post[]                           // relacionamento (não vira coluna, ver seção 5)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")                             // nome da tabela no banco
}

enum Role {
  USER
  ADMIN
}
```

Cada linha é: **`nomeDoCampo  Tipo  @atributos`**

### Tipos mais usados

| Prisma      | PostgreSQL         | TypeScript | Uso                                    |
| ----------- | ------------------ | ---------- | -------------------------------------- |
| `String`    | `TEXT`             | `string`   | textos                                 |
| `Int`       | `INTEGER`          | `number`   | números inteiros                       |
| `Float`     | `DOUBLE PRECISION` | `number`   | números com vírgula (não use para dinheiro!) |
| `Decimal`   | `DECIMAL(65,30)`   | `Decimal`  | **dinheiro**, valores exatos           |
| `Boolean`   | `BOOLEAN`          | `boolean`  | verdadeiro/falso                       |
| `DateTime`  | `TIMESTAMP(3)`     | `Date`     | datas e horários                       |
| `Json`      | `JSONB`            | objeto     | dados livres em JSON                   |
| `BigInt`    | `BIGINT`           | `bigint`   | inteiros muito grandes                 |

Modificadores: **`Tipo?`** = opcional (aceita `null`) · **`Tipo[]`** = lista.

Tipos específicos do Postgres com `@db.`: `name String @db.VarChar(100)` (texto de no máximo 100 caracteres),
`price Decimal @db.Decimal(10, 2)` (10 dígitos, 2 depois da vírgula).

### Atributos de campo (`@`)

| Atributo                       | O que faz                                                        |
| ------------------------------ | ---------------------------------------------------------------- |
| `@id`                          | Chave primária.                                                  |
| `@default(autoincrement())`    | Número que aumenta sozinho (1, 2, 3...).                         |
| `@default(uuid())` / `@default(cuid())` | Gera um ID em texto aleatório (use com `String`).      |
| `@default(now())`              | Data/hora atual no momento da criação.                           |
| `@default(valor)`              | Valor padrão (ex: `@default(false)`, `@default(USER)`).          |
| `@unique`                      | Não permite valores repetidos (ex: e-mail).                      |
| `@updatedAt`                   | Atualiza a data sozinho sempre que o registro muda.              |
| `@map("nome_coluna")`          | Nome da coluna no banco diferente do nome no código.             |
| `@relation(...)`               | Configura um relacionamento (seção 5).                           |

### Atributos de model (`@@`)

| Atributo                    | O que faz                                                       |
| --------------------------- | --------------------------------------------------------------- |
| `@@map("users")`            | Nome da tabela no banco.                                        |
| `@@unique([campo1, campo2])`| A **combinação** dos campos não pode se repetir.                |
| `@@index([campo])`          | Cria um índice (deixa buscas por esse campo mais rápidas).      |
| `@@id([campo1, campo2])`    | Chave primária composta por dois campos.                        |

### Convenção de nomes (boa prática)

- No **código** (Prisma/TS): `camelCase` e singular → model `User`, campo `createdAt`.
- No **banco** (Postgres): `snake_case` e plural → tabela `users`, coluna `created_at`.
- O `@map` e o `@@map` fazem essa "tradução". Não é obrigatório, mas deixa o banco no padrão do Postgres.

### Comandos úteis para o schema

```bash
npx prisma format     # organiza/alinha o schema.prisma (e aponta erros)
npx prisma validate   # só confere se o schema está válido
```

> 💡 Instale a extensão **Prisma** no VS Code: colore o schema, dá autocomplete e formata ao salvar.

---

## 5 - Relacionamentos entre tabelas

### Um para muitos (1:N), o mais comum

"Um usuário tem **muitos** posts; cada post tem **um** autor."

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]                                       // lado "muitos": NÃO vira coluna no banco
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId Int                                       // a coluna REAL (foreign key)

  @@index([authorId])                                // boa prática: índice na FK
}
```

Lendo o `@relation`: *"o campo `authorId` deste model aponta para o campo `id` do `User`"*.

- **`authorId`** → a coluna de verdade, salva no banco (a FK).
- **`author`** e **`posts`** → campos "virtuais": não existem no banco, servem para o Prisma
  buscar os dados relacionados (com `include`, seção 8).
- A FK fica sempre no lado "muitos" (o post guarda quem é o autor).

### `onDelete`: o que acontece com os filhos quando o pai é apagado

| Valor       | Efeito ao apagar o usuário                                         |
| ----------- | ------------------------------------------------------------------ |
| `Cascade`   | Apaga os posts dele junto.                                         |
| `Restrict`  | **Impede** apagar o usuário enquanto ele tiver posts (padrão).     |
| `SetNull`   | Deixa `authorId` como `null` (o campo precisa ser opcional `Int?`).|

### Um para um (1:1)

"Um usuário tem **um** perfil." Igual ao 1:N, mas a FK é `@unique`:

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?                                   // ? = o usuário pode não ter perfil
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique                              // @unique = no máximo 1 perfil por usuário
}
```

### Muitos para muitos (N:N)

"Um post tem **várias** tags; uma tag está em **vários** posts."

**Forma implícita** (o Prisma cria a tabela do meio sozinho):

```prisma
model Post {
  id   Int   @id @default(autoincrement())
  tags Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

**Forma explícita** (você cria a tabela do meio). Use quando precisar guardar **dados extras** na relação,
por exemplo a quantidade de um produto num pedido:

```prisma
model Order {
  id    Int         @id @default(autoincrement())
  items OrderItem[]
}

model Product {
  id     Int         @id @default(autoincrement())
  orders OrderItem[]
}

model OrderItem {
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   Int
  product   Product @relation(fields: [productId], references: [id])
  productId Int
  quantity  Int                                      // o dado extra da relação

  @@id([orderId, productId])                         // chave composta: o mesmo produto não se repete no pedido
}
```

---

## 6 - Migrations

Uma **migration** é um arquivo `.sql` com as alterações que precisam ser feitas no banco para ele ficar igual
ao seu `schema.prisma`. Funciona como um **"git do banco de dados"**: cada alteração fica registrada em ordem.

### Em desenvolvimento

```bash
npx prisma migrate dev --name criar_tabela_users
npx prisma generate
```

O que o `migrate dev` faz:

1. Compara o `schema.prisma` com o banco.
2. Cria a pasta `prisma/migrations/20261020001627_criar_tabela_users/migration.sql` com o SQL necessário.
3. Executa esse SQL no banco.

> ⚠️ **No Prisma 7 o `migrate dev` NÃO roda mais o `generate` sozinho.** Sempre rode
> `npx prisma generate` depois, senão o TypeScript não vai conhecer os campos novos.

Exemplo do SQL gerado (dá para abrir e ler, é ótimo para aprender SQL):

```sql
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

### Todos os comandos

| Comando                          | Quando usar                                                                 |
| -------------------------------- | --------------------------------------------------------------------------- |
| `npx prisma migrate dev --name x`| **Dev**: mudou o schema → cria e aplica uma migration nova.                 |
| `npx prisma generate`            | Depois de toda mudança no schema (atualiza o client e os tipos).            |
| `npx prisma migrate deploy`      | **Produção**: só aplica as migrations que já existem. Nunca cria novas.     |
| `npx prisma migrate status`      | Mostra quais migrations já foram aplicadas no banco.                        |
| `npx prisma migrate reset`       | ⚠️ **Apaga o banco inteiro**, recria e reaplica tudo. Só em dev!            |
| `npx prisma db push`             | Joga o schema direto no banco **sem criar migration**. Bom para protótipos rápidos. |
| `npx prisma db pull`             | O contrário: lê um banco **que já existe** e escreve o `schema.prisma` a partir dele. |

### Regras de ouro

- **Nunca edite** uma migration que já foi aplicada (principalmente se já foi para o git/produção). Precisa mudar algo?
  Altere o schema e crie **outra** migration.
- **Nunca apague** a pasta `migrations` em um projeto que já está em produção.
- Dê **nomes descritivos**: `--name adicionar_bio_no_user`, e não `--name teste2`.
- Adicionou um campo **obrigatório** numa tabela que já tem dados? O Prisma vai reclamar (as linhas antigas
  ficariam sem valor). Solução: coloque um `@default(...)` ou crie o campo como opcional (`?`).

---

## 7 - O Prisma Client (conexão)

Crie **um único arquivo** que faz a conexão e exporta o `prisma`. Todo o projeto importa daqui:

```ts
// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
```

- O import é do **caminho do `output`** do generator (`../generated/prisma/client.js`), **não** de `@prisma/client`.
- **Por que só uma instância?** Cada `new PrismaClient()` abre um conjunto de conexões com o banco. Criar um
  em cada arquivo esgota as conexões rapidinho. Com um arquivo só, todos reaproveitam a mesma.
- Para ver no terminal o SQL que o Prisma executa (ótimo para aprender e depurar):
  `new PrismaClient({ adapter, log: ["query"] })`.

---

## 8 - Métodos (CRUD e consultas)

Todos os métodos ficam em `prisma.<nomeDoModel>` (com a **primeira letra minúscula**: `prisma.user`, `prisma.post`)
e **retornam Promise**, então sempre use `await`.

### Tabela de métodos

| Método          | Retorna                    | Para que serve                                               |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| `findMany`      | `array` (pode ser `[]`)    | Buscar vários registros.                                     |
| `findUnique`    | `objeto` ou `null`         | Buscar 1 registro por campo `@id` ou `@unique`.              |
| `findFirst`     | `objeto` ou `null`         | Buscar o primeiro que bater com um filtro qualquer.          |
| `findUniqueOrThrow` / `findFirstOrThrow` | `objeto` | Igual aos de cima, mas **lança erro** (P2025) se não achar. |
| `create`        | `objeto` criado            | Criar 1 registro.                                            |
| `createMany`    | `{ count }`                | Criar vários de uma vez.                                     |
| `update`        | `objeto` atualizado        | Atualizar 1 (por `@id`/`@unique`). **Erro P2025** se não existir. |
| `updateMany`    | `{ count }`                | Atualizar vários que batem com o filtro.                     |
| `upsert`        | `objeto`                   | Atualiza se existir, cria se não existir.                    |
| `delete`        | `objeto` apagado           | Apagar 1. **Erro P2025** se não existir.                     |
| `deleteMany`    | `{ count }`                | Apagar vários. ⚠️ Sem `where` apaga **TODOS**.               |
| `count`         | `number`                   | Contar registros.                                            |
| `aggregate`     | objeto                     | Soma, média, mínimo, máximo.                                 |
| `groupBy`       | array                      | Agrupar (ex: quantidade de posts por autor).                 |

### CREATE

```ts
const user = await prisma.user.create({
  data: { name: "Ana", email: "ana@email.com", password: hash },
});

// Criando junto com os relacionados (nested create)
await prisma.user.create({
  data: {
    name: "Ana",
    email: "ana@email.com",
    password: hash,
    posts: { create: [{ title: "Primeiro post" }, { title: "Segundo post" }] },
  },
});

// Ligando a um registro que JÁ existe
await prisma.post.create({
  data: { title: "Novo", author: { connect: { id: 1 } } },   // ou simplesmente: authorId: 1
});

await prisma.user.createMany({ data: [{ ... }, { ... }], skipDuplicates: true });
```

### READ

```ts
await prisma.user.findMany();                                   // todos
await prisma.user.findUnique({ where: { id: 1 } });             // por id
await prisma.user.findUnique({ where: { email: "ana@email.com" } });
await prisma.user.findFirst({ where: { name: "Ana" } });        // por campo que não é @unique
```

### UPDATE

```ts
await prisma.user.update({
  where: { id: 1 },
  data: { name: "Ana Maria" },
});

await prisma.post.update({
  where: { id: 1 },
  data: { views: { increment: 1 } },        // também tem decrement, multiply, divide
});

await prisma.post.updateMany({
  where: { authorId: 1 },
  data: { published: true },
});

await prisma.user.upsert({
  where: { email: "ana@email.com" },
  update: { name: "Ana" },                 // se existir
  create: { name: "Ana", email: "ana@email.com", password: hash }, // se não existir
});
```

### DELETE

```ts
await prisma.user.delete({ where: { id: 1 } });
await prisma.post.deleteMany({ where: { published: false } });
```

### Filtros (`where`)

```ts
await prisma.user.findMany({
  where: {
    name: { contains: "ana", mode: "insensitive" }, // contém, ignorando maiúsculas/minúsculas
    email: { endsWith: "@gmail.com" },               // também: startsWith, equals
    age: { gte: 18, lt: 60 },                        // gt (>), gte (>=), lt (<), lte (<=)
    role: { in: ["ADMIN", "USER"] },                 // está na lista (notIn = não está)
    bio: { not: null },                              // diferente de
    createdAt: { gte: new Date("2026-01-01") },
  },
});

// OU / E / NÃO
await prisma.user.findMany({
  where: {
    OR: [{ name: { contains: "ana" } }, { email: { contains: "ana" } }],
    NOT: { role: "ADMIN" },
  },
});

// Filtrar pelos relacionados
await prisma.user.findMany({
  where: { posts: { some: { published: true } } },  // usuários com PELO MENOS 1 post publicado
});                                                  // também: every (todos), none (nenhum)
```

### Escolhendo os campos: `select`, `include` e `omit`

```ts
// select → traz SÓ os campos escolhidos
await prisma.user.findMany({ select: { id: true, name: true, email: true } });

// include → traz tudo + os relacionados (faz o "JOIN")
await prisma.user.findUnique({ where: { id: 1 }, include: { posts: true } });

// include com filtro nos relacionados
await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: { where: { published: true }, orderBy: { createdAt: "desc" } } },
});

// omit → traz tudo, MENOS os campos escolhidos (ótimo para esconder a senha!)
await prisma.user.findMany({ omit: { password: true } });
```

> Não dá para usar `select` e `include` juntos no mesmo nível. Para trazer campos escolhidos + relação, use
> `select` com a relação dentro: `select: { name: true, posts: true }`.

### Ordenação e paginação

```ts
const page = 2;
const perPage = 10;

await prisma.post.findMany({
  orderBy: { createdAt: "desc" },           // "asc" = crescente, "desc" = decrescente
  skip: (page - 1) * perPage,               // pula os registros das páginas anteriores
  take: perPage,                            // quantos trazer
});
```

### Contagem e agregações

```ts
await prisma.post.count({ where: { authorId: 1 } });             // 5

await prisma.order.aggregate({
  _sum: { total: true },
  _avg: { total: true },
  _max: { createdAt: true },
});

await prisma.post.groupBy({
  by: ["authorId"],
  _count: { _all: true },                    // quantos posts cada autor tem
});
```

### Transactions (tudo ou nada)

Quando várias operações precisam dar certo **juntas** (se uma falhar, nenhuma é salva):

```ts
// Forma 1: lista de operações independentes
const [user, total] = await prisma.$transaction([
  prisma.user.create({ data: { ... } }),
  prisma.post.count(),
]);

// Forma 2: função (quando uma operação depende do resultado da outra)
await prisma.$transaction(async (tx) => {
  const conta = await tx.account.update({
    where: { id: origemId },
    data: { saldo: { decrement: valor } },
  });
  if (conta.saldo < 0) throw new Error("Saldo insuficiente");   // o throw DESFAZ tudo (rollback)

  await tx.account.update({
    where: { id: destinoId },
    data: { saldo: { increment: valor } },
  });
});
```

> Dentro da função use sempre o **`tx`**, e não o `prisma`, senão a operação fica fora da transaction.

### SQL puro (quando precisar)

```ts
const email = "ana@email.com";
const users = await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;
```

O formato com crases (template literal) **protege contra SQL Injection** automaticamente.
**Nunca** monte SQL juntando strings (`"... WHERE email = '" + email + "'"`).

---

## 9 - Integrando com as camadas

Seguindo a organização do `inicializacao.MD` (seções 7 e 9). O **Prisma só aparece no model**: o resto do
projeto nem sabe que ele existe. Se um dia trocar de ORM, só o model muda.

```
Controller (req/res) → Service (regras + AppError) → Model (Prisma) → PostgreSQL
```

### Tipos gerados

O Prisma gera os tipos de tudo automaticamente, a partir do schema:

```ts
import type { User, Post, Prisma } from "../generated/prisma/client.js";

User                       // { id: number; name: string; email: string; ... } (o registro do banco)
Prisma.UserCreateInput     // o que o create aceita
Prisma.UserUpdateInput     // o que o update aceita (tudo opcional)
Prisma.UserWhereInput      // os filtros possíveis
```

### Model: só acessa o banco

```ts
// src/models/user.model.ts
import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

const publicFields = { password: true } as const;   // campos que nunca saem da API

export function findAll() {
  return prisma.user.findMany({ omit: publicFields, orderBy: { createdAt: "desc" } });
}

export function findById(id: number) {
  return prisma.user.findUnique({ where: { id }, omit: publicFields, include: { posts: true } });
}

export function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });   // com senha: usado no login
}

export function create(data: Prisma.UserCreateInput) {
  return prisma.user.create({ data, omit: publicFields });
}

export function update(id: number, data: Prisma.UserUpdateInput) {
  return prisma.user.update({ where: { id }, data, omit: publicFields });
}

export function remove(id: number) {
  return prisma.user.delete({ where: { id } });
}
```

### Service: regras de negócio

```ts
// src/services/user.service.ts
import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError.js";
import * as userModel from "../models/user.model.js";
import type { CreateUserInput } from "../schemas/user.schema.js";

export async function getById(id: number) {
  const user = await userModel.findById(id);
  if (!user) throw new AppError(404, "Usuário não encontrado");   // findUnique retorna null
  return user;
}

export async function create(data: CreateUserInput) {
  const exists = await userModel.findByEmail(data.email);
  if (exists) throw new AppError(409, "E-mail já cadastrado");

  const password = await bcrypt.hash(data.password, 10);           // nunca salve a senha pura
  return userModel.create({ ...data, password });
}
```

### Controller: só req/res

```ts
// src/controllers/user.controller.ts
import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import { createUserSchema } from "../schemas/user.schema.js";

export async function getById(req: Request, res: Response) {
  const user = await userService.getById(Number(req.params.id));
  res.json(user);
}

export async function create(req: Request, res: Response) {
  const data = createUserSchema.parse(req.body);   // zod valida antes de chegar no banco
  const user = await userService.create(data);
  res.status(201).json(user);
}
```

> O `bcrypt` (gera o hash da senha) precisa ser instalado: `npm i bcrypt` e `npm i -D @types/bcrypt`.

> Repare: nenhum `try/catch`. Os erros (do zod, o `AppError` ou do Prisma) sobem sozinhos até o
> `errorHandler` (Express 5).

---

## 10 - Tratando erros do Prisma

Quando o banco recusa uma operação, o Prisma lança um `PrismaClientKnownRequestError` com um **código**:

| Código    | Significa                                                    | Status HTTP sugerido |
| --------- | ------------------------------------------------------------ | -------------------- |
| **P2002** | Violou um `@unique` (ex: e-mail repetido). `err.meta` diz qual campo. | 409 Conflict |
| **P2025** | Registro não encontrado (`update`/`delete`/`...OrThrow`).   | 404 Not Found        |
| **P2003** | Violou uma foreign key (ex: `authorId` que não existe).     | 400 Bad Request      |

Adicione no `errorHandler` (antes do "erro 500"), assim esses casos viram respostas amigáveis sozinhos:

```ts
// src/middlewares/errorHandler.ts
import { Prisma } from "../generated/prisma/client.js";

// ... dentro do errorHandler:
if (err instanceof Prisma.PrismaClientKnownRequestError) {
  if (err.code === "P2002") return res.status(409).json({ message: "Registro já existe" });
  if (err.code === "P2025") return res.status(404).json({ message: "Registro não encontrado" });
  if (err.code === "P2003") return res.status(400).json({ message: "Referência inválida" });
}
```

> Aqui o `Prisma` é importado **sem** `import type`, porque o `instanceof` precisa da classe de verdade
> (em tempo de execução), não só do tipo.

---

## 11 - Seed (dados iniciais)

O **seed** popula o banco com dados iniciais: um usuário admin, categorias fixas, dados de teste...

```ts
// prisma/seed.ts
import { prisma } from "../src/lib/prisma.js";

async function main() {
  await prisma.user.upsert({                       // upsert: rodar o seed 2x não duplica
    where: { email: "admin@email.com" },
    update: {},
    create: { name: "Admin", email: "admin@email.com", password: "hash-aqui", role: "ADMIN" },
  });
  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());            // fecha a conexão no final
```

No `prisma.config.ts` (já está no exemplo da seção 3):

```ts
migrations: {
  path: "prisma/migrations",
  seed: "tsx --env-file=.env prisma/seed.ts",
},
```

Rodar: `npx prisma db seed`

---

## 12 - Prisma Studio

Uma interface visual no navegador para **ver e editar os dados** das tabelas (como uma planilha):

```bash
npx prisma studio
```

Ótimo para conferir se o `create` realmente salvou, apagar dados de teste etc.

---

## 13 - Scripts no package.json

```json
"scripts": {
  "dev": "tsx watch --env-file=.env src/server.ts",
  "build": "prisma generate && tsc",
  "start": "node --env-file=.env dist/server.js",
  "postinstall": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:generate": "prisma generate",
  "db:deploy": "prisma migrate deploy",
  "db:seed": "prisma db seed",
  "db:studio": "prisma studio",
  "db:reset": "prisma migrate reset"
}
```

- **postinstall** → roda sozinho depois de todo `npm install`. Como a pasta `generated` não vai para o git,
  quem clonar o projeto já ganha o client gerado.
- **build** → gera o client antes de compilar, para nunca compilar com tipos desatualizados.
- Para criar uma migration com nome usando o script: `npm run db:migrate -- --name adicionar_bio`
  (o `--` passa os argumentos para o comando).

---

## 14 - Erros comuns

| Erro / Sintoma                                                       | Causa e solução                                                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Could not find Prisma Schema` / `Missing script` / `node_modules` onde não devia | Rodou o comando fora da pasta do `package.json` do servidor (seção 2). |
| `Can't reach database server at localhost:5432`                      | O Postgres não está rodando, ou host/porta errados na URL. Suba o banco (seção 1). |
| `Authentication failed against database server`                      | Usuário/senha errados na `DATABASE_URL`. Senha com caracteres especiais precisa ser codificada. |
| `Environment variable not found: DATABASE_URL`                       | Faltou o `import "dotenv/config"` no `prisma.config.ts` ou o `.env` não existe.  |
| `The datasource.url property is required` / a CLI ignora a config     | O arquivo não se chama `prisma.config.ts` (ex: `prisma7.config.ts`). Renomeie ou use `--config` (seção 3). |
| `Property 'novoCampo' does not exist on type...`                     | Mudou o schema e esqueceu do `npx prisma generate`.                              |
| `Cannot find module '../generated/prisma/client.js'`                 | Client ainda não foi gerado (`npx prisma generate`) ou o caminho do `output` está diferente do import. |
| `ERR_MODULE_NOT_FOUND ... enums.ts` (só no `npm start`)              | Faltou o `importFileExtension = "js"` no generator (seção 4).                    |
| `TS6059: File 'prisma.config.ts' is not under 'rootDir'`             | Faltou o `"include": ["src"]` no tsconfig (seção 3).                             |
| `permission denied to create database` (no `migrate dev`)            | O usuário do banco precisa da permissão `CREATEDB` (seção 1, opção C).          |
| `Drift detected` / pede para resetar o banco                         | O banco foi alterado "por fora" das migrations (ou com `db push`). Em dev: `npx prisma migrate reset`. |
| `Unique constraint failed` / P2002                                   | Tentou salvar um valor repetido num campo `@unique` (seção 10).                  |
| Erros estranhos depois de instalar                                   | Versões diferentes entre `prisma`, `@prisma/client` e `@prisma/adapter-pg` (seção 2). |
| "Too many connections"                                               | Está criando vários `new PrismaClient()`. Use só o de `lib/prisma.ts`.          |

---

## 15 - Resumo do dia a dia + checklist

### Comecei um projeto novo

- [ ] Postgres rodando (prisma dev, Docker, local ou nuvem)
- [ ] Terminal na pasta do `package.json` do servidor (raiz ou `backend/`, seção 2)
- [ ] `npm i @prisma/client@7 @prisma/adapter-pg@7 pg` e `npm i -D prisma@7 dotenv`
- [ ] `npx prisma init --datasource-provider postgresql`
- [ ] Arquivo com o nome `prisma.config.ts`, com `import "dotenv/config"`
- [ ] `DATABASE_URL` no `.env` (+ `.env.example` sem a senha)
- [ ] Generator com `output` e `importFileExtension = "js"`
- [ ] `.gitignore` com `.env` e `src/generated/`
- [ ] tsconfig com `"include": ["src"]`
- [ ] `src/lib/prisma.ts` com a instância única
- [ ] Models no `schema.prisma` → `migrate dev` → `generate`
- [ ] Erros do Prisma (P2002, P2025, P2003) no `errorHandler`
- [ ] Scripts `db:*`, `postinstall` e `build` com `prisma generate`

### Preciso alterar o banco (o mais comum)

```bash
# 1. edito o prisma/schema.prisma
npx prisma migrate dev --name descricao_da_mudanca   # 2. cria e aplica a migration
npx prisma generate                                  # 3. atualiza os tipos
# 4. uso os campos novos no código
```

### Clonei o projeto em outra máquina

```bash
cd backend                  # (só no formato B)
npm install                 # o postinstall já roda o prisma generate
cp .env.example .env        # e preencho a DATABASE_URL
npx prisma migrate dev      # cria as tabelas no meu banco local
npx prisma db seed          # (opcional) dados iniciais
```

### Vou publicar (produção)

```bash
cd backend                  # (só no formato B)
npm ci
npx prisma migrate deploy   # aplica as migrations (NUNCA use migrate dev ou reset em produção)
npm run build
npm start
```

---

## 16 - Extra: comandos do psql

O `psql` é o terminal do Postgres. Útil para conferir as coisas "por baixo" do Prisma.

```bash
psql "postgresql://meu_usuario:minha_senha@localhost:5432/meu_banco"
# ou, com Docker:
docker exec -it meu-projeto-db psql -U meu_usuario -d meu_banco
```

| Comando           | O que faz                              |
| ----------------- | -------------------------------------- |
| `\l`              | Lista os bancos                        |
| `\c nome_do_banco`| Conecta em outro banco                 |
| `\dt`             | Lista as tabelas                       |
| `\d users`        | Mostra as colunas da tabela `users`    |
| `\q`              | Sai                                    |

SQL básico (sempre termine com `;`):

```sql
SELECT * FROM users;                                    -- ver tudo
SELECT id, name FROM users WHERE role = 'ADMIN';        -- com filtro
SELECT COUNT(*) FROM posts;                             -- contar
SELECT * FROM "_prisma_migrations";                     -- histórico de migrations que o Prisma guarda
```
