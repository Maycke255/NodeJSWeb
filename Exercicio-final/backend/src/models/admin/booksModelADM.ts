// MODEL: a única camada que conversa com o banco (via Prisma).
// Recebe dados JÁ validados pelo Zod no controller e aplica as regras de negócio
// (livro repetido?, livro existe?, tem empréstimos?). Quando uma regra falha,
// lança um HttpError com throw, e ele sobe sozinho até o errorHandler.

import { prisma } from "../../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
// Tipo gerado pelo Prisma a partir do model Book. Diferente do User, não precisa de
// "PublicBook" nem de select: o livro não tem nenhum campo privado, então sai inteiro.
import type { Book } from "../../generated/prisma/client.js";
import { HttpError } from "../../errors/HttpError.js"; // erro com status HTTP (404, 409...)
import { type CreateBookInput, type UpdateBookInput } from "../../schemas/bookSchema.js"; // tipos gerados pelo Zod

class BookModelADM {
    // CREATE: CADASTRAR LIVRO
    // static = chamo direto pela classe (BookModelADM.create(...)), sem precisar de "new".
    // Promise<Book> = a função é async e, quando terminar, devolve o livro criado.
    static async create (data: CreateBookInput): Promise<Book> {
        // ♻️ PADRÃO REUTILIZÁVEL: "essa combinação já existe?"
        // O mesmo livro (título + autor) não pode ser cadastrado duas vezes:
        // as cópias de um livro são controladas pelo quantityAvailable.
        // findFirst (e não findUnique) porque o mode: "insensitive" só funciona nele.
        // insensitive = ignora maiúsculas/minúsculas: "Dom Casmurro" e "dom casmurro" contam como iguais.
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

        // Se achou (não é null), o livro já está cadastrado: 409 Conflict.
        if (bookExist) throw new HttpError(409, `O livro ${data.title} existe para o autor ${data.author}!`);

        // Sem select: devolve o livro com todas as colunas.
        return await prisma.book.create({ data: data });
    }

    // UPDATE: ATUALIZAR SOMENTE OS DADOS ENVIADOS
    // data vem do updateBookSchema (.partial()), então todos os campos são opcionais:
    // o que não foi enviado não aparece no objeto e o Prisma não mexe nele.
    static async update (id: string, data: UpdateBookInput): Promise<Book> {
        // ♻️ PADRÃO REUTILIZÁVEL: "esse livro existe?"
        // findUnique busca por um campo @id ou @unique e devolve o registro ou null.
        const bookIdExist = await prisma.book.findUnique({
            where: {
                id: id
            }
        });

        // Repare no "!": se NÃO achou (é null), responde 404 Not Found.
        if (!bookIdExist) throw new HttpError(404, `O livro solicitado não existe!`);

        // Só precisa checar livro repetido se o título ou o autor foram enviados.
        // Se veio só o quantityAvailable, por exemplo, pula direto para o update.
        if (data.title || data.author) {
            // ?? = "se não veio no data, usa o que já está no banco".
            // Assim confere a combinação como ela vai FICAR depois do update.
            const title = data.title ?? bookIdExist.title;
            const author = data.author ?? bookIdExist.author;

            // Mesmo padrão do create, com uma diferença: o id: { not: id }.
            // Sem ele, a busca acharia o PRÓPRIO livro que está sendo editado
            // (ex: só corrigindo "dom casmurro" para "Dom Casmurro") e daria 409 à toa.
            const bookExist = await prisma.book.findFirst({
                where: {
                    id: {
                        not: id // "id diferente deste": ignora o próprio livro
                    },
                    title: {
                        equals: title, mode: "insensitive"
                    },
                    author: {
                        equals: author, mode: "insensitive"
                    }
                }
            });

            // Achou OUTRO livro com a mesma combinação: 409 Conflict.
            if (bookExist) throw new HttpError(409, `O livro ${title} já existe para o autor ${author}!`);
        }

        // Atualiza só os campos que vieram em "data".
        // O @@unique([title, author]) do schema.prisma é a segunda proteção: se algo
        // escapar da checagem acima, o banco recusa com o erro P2002 (vira 409 no errorHandler).
        return await prisma.book.update({
            where: {
                id: id
            },
            data
        });
    }

    // DELETE: DELETAR LIVRO
    // Devolve o livro apagado, para o controller poder montar a mensagem com o título.
    static async delete (id: string): Promise<Book> {
        // ♻️ Mesmo padrão do update: o livro existe?
        const bookIdExist = await prisma.book.findUnique({
            where: {
                id: id
            }
        });

        if (!bookIdExist) throw new HttpError(404, `O livro solicitado não existe!`);

        // ♻️ PADRÃO REUTILIZÁVEL: "existe algum registro ligado a este?"
        // count devolve QUANTOS registros batem com o filtro (aqui: empréstimos deste livro).
        // Necessário porque a migration criou a FK com ON DELETE RESTRICT: o banco
        // recusaria apagar um livro com empréstimos e daria erro 500.
        const loans = await prisma.loan.count({
            where: { bookId: id }
        });
        if (loans > 0) throw new HttpError(409, "Não é possível excluir um livro com empréstimos registrados!");

        // Apaga e devolve o registro apagado.
        return await prisma.book.delete({
            where: {
                id: id
            }
        })
    }
}

export default BookModelADM;
