// MODEL (leitura de livros): busca livros no banco via Prisma.
// Devolve só dados; quem escolhe a mensagem de sucesso é o controller.

import { prisma } from "../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import { HttpError } from "../errors/HttpError.js"; // erro com status HTTP (404, 409...)
// Tipo gerado pelo Prisma. Livro não tem campo privado, então não precisa de select.
import type { Book } from "../generated/prisma/client.js";

class BookModel {
    // GET ALL: todos os livros. findMany nunca devolve null: sem livros, devolve [].
    static async index (): Promise<Book[]> {
        return await prisma.book.findMany();
    }

    // GET BY ID: devolve UM livro ou lança 404.
    static async indexById (id: string): Promise<Book> {
        // ♻️ PADRÃO REUTILIZÁVEL: "esse registro existe?" (findUnique → registro ou null)
        const book = await prisma.book.findUnique({ where: { id: id } });
        if (!book) throw new HttpError(404, "livro não encontrado no sistema!");
        return book;
    }
}

export default BookModel;
