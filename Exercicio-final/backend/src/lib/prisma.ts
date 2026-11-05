// CONEXÃO ÚNICA COM O BANCO. Todo o projeto importa o "prisma" daqui.
// Só uma instância: cada new PrismaClient() abre suas próprias conexões,
// e criar um por arquivo esgota as conexões do banco.

import { PrismaPg } from "@prisma/adapter-pg"; // adaptador do Postgres (obrigatório no Prisma 7)
import { PrismaClient } from "../generated/prisma/client.js"; // client gerado pelo "npx prisma generate"

// O adapter usa a URL do .env para saber em qual banco conectar.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Cada model do schema vira uma propriedade: prisma.user, prisma.book, prisma.loan.
export const prisma = new PrismaClient({ adapter });
