import { prisma } from "../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import { HttpError } from "../errors/HttpError.js"; // erro com status HTTP (404, 409...)
import type { Book } from "../generated/prisma/client.js";

class BookModel {
    static async index (): Promise<Book[]> {
        return await prisma.book.findMany();
    }

    static async indexById (id: string): Promise<Book> {
        const book = await prisma.book.findUnique({ where: { id: id } });
        if (!book) throw new HttpError(404, "Usuario não encontrado no sistema!");
        return book;
    }
}

export default BookModel;