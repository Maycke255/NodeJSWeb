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
        //Primeiro verificamos se o livro cujo autor e o mesmo já existe, afinal, não faz sentido existir o 2 livros para o mesmo autor
        const  bookExist = await prisma.book.findFirst({
            where: {
                title: {
                    equals: data.title, mode: "insensitive"
                },
                author: {
                    equals: data.author, mode: "insensitive"
                }
                
            }
        });

        if (bookExist) throw new HttpError(409, `O livro ${data.title} existe para o autor ${data.author}!`);

        return await prisma.book.create({ data: data });
    }

    //UPDATE:ID
    static async update (id: string, data: UpdateBookInput): Promise<Book> {
        const bookIdExist = await prisma.book.findUnique({
            where: {
                id: id
            }
        });

        if (!bookIdExist) throw new HttpError(404, `O livro solicitado não existe!`);

        if (data.title || data.author) {
            // ?? = "se não veio no data, usa o que já está no banco".
            // Assim confere a combinação como ela vai FICAR depois do update.
            const title = data.title ?? bookIdExist.title;
            const author = data.author ?? bookIdExist.author;

            const bookExist = await prisma.book.findFirst({
                where: {
                    id: {
                        not: id
                    },
                    title: {
                        equals: title, mode: "insensitive"
                    },
                    author: {
                        equals: author, mode: "insensitive"
                    }
                }
            });

            if (bookExist) throw new HttpError(409, `O livro ${title} já existe para o autor ${author}!`);
        }

        return await prisma.book.update({
            where: {
                id: id
            },
            data
        });
    }

    //DELETE:ID
    static async delete (id: string): Promise<Book> {
        const bookIdExist = await prisma.book.findUnique({
            where: {
                id: id
            }
        });

        if (!bookIdExist) throw new HttpError(404, `O livro solicitado não existe!`);

        const loans = await prisma.loan.count({
            where: { bookId: id }
        });
        if (loans > 0) throw new HttpError(409, "Não é possível excluir um livro com empréstimos registrados!");

        return await prisma.book.delete({
            where: {
                id: id
            }
        })
    }
}

export default BookModelADM;