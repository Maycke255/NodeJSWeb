// MODEL: a única camada que conversa com o banco (via Prisma).
// Recebe dados JÁ validados pelo Zod no controller e aplica as regras de negócio
// (e-mail repetido, usuário existe?, tem empréstimos?). Quando uma regra falha,
// lança um HttpError com throw, e ele sobe sozinho até o errorHandler.

import { prisma } from "../../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import type { Book } from "../../generated/prisma/client.js";
import { HttpError } from "../../errors/HttpError.js"; // erro com status HTTP (404, 409...)
import { type CreateBookInput, type UpdateBookInput } from "../../schemas/bookSchema.js"; // tipos gerados pelo Zod

class BookModelADM {
    //CREATE
    static async create (data: CreateBookInput): Promise<Book> {

    }

    //UPDATE:ID
    static async update (id: string, data: UpdateBookInput): Promise<Book> {

    }

    //DELETE:ID
    static async delete (id: string): Promise<Book> {

    }
}

export default BookModelADM;