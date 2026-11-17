// MODEL (escrita de empréstimos): criar o empréstimo e registrar a devolução.
// Não tem delete de propósito: empréstimos ficam guardados como histórico.
// As duas funções gravam em DUAS tabelas (loan + book), por isso usam $transaction:
// ou tudo dá certo, ou nada é salvo.

import { prisma } from "../../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import { type Loan } from "../../generated/prisma/client.js"; // tipo gerado pelo Prisma a partir do model Loan
import { HttpError } from "../../errors/HttpError.js"; // erro com status HTTP (404, 409...)

class LoansModelADM {
    // CREATE: EMPRESTAR UM LIVRO
    // Recebe userId e bookId separados (e não o tipo do schema): o model não precisa
    // saber de onde vieram. Hoje o userId vem do body; depois do login, do req.user.
    // Só o controller muda nessa troca.
    static async create (userId: string, bookId: string): Promise<Loan> {
        // $transaction: as operações só valem se TODAS derem certo.
        // Qualquer throw aqui dentro desfaz o que já foi feito (rollback).
        // Lá dentro, use sempre "tx" e nunca "prisma", senão a operação fica de fora.
        return prisma.$transaction( async (tx) => {
            // 1. ♻️ O livro existe?
            const book = await tx.book.findUnique({
                where: {
                    id: bookId
                }
            });
            if (!book) throw new HttpError(404, "Livro não encontrado!");

            // 2. Este usuário já está com este livro?
            // findFirst (e não findUnique) porque userId/bookId não são @unique.
            // isReturned: false = só empréstimos ATIVOS (os devolvidos ficam no histórico).
            const activeLoan = await tx.loan.findFirst({
                where: {
                    userId: userId, bookId: bookId, isReturned: false
                }
            });
            if (activeLoan) throw new HttpError(409, "Você já esta com um exemplar desse livro!");

            // 3. Tem exemplar na estante? Se tiver, já tira um.
            // A condição de estoque fica DENTRO do where: o banco testa e desconta numa
            // única operação. Assim, dois pedidos pelo último exemplar ao mesmo tempo
            // não deixam o estoque negativo: só um consegue.
            // gt = greater than (maior que). decrement = subtrai.
            const taken = await tx.book.updateMany({
                where: {
                    id: bookId, quantityAvailable: { gt: 0 }
                },
                data: { quantityAvailable: { decrement: 1 } }
            });
            // updateMany devolve { count }: 0 = nenhum livro com estoque bateu com o filtro.
            if (taken.count === 0) throw new HttpError(409, "Não há exemplares desse livro disponiveis no estoque!");

            // 4. Prazo de devolução: hoje + 14 dias.
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
            dueDate.setHours(23, 59, 59, 999); // prazo vai até o fim do dia

            // 5. Cria o empréstimo. id, createdAt, isReturned e isLate vêm dos @default do schema.
            return tx.loan.create({
                data: { userId: userId, bookId: bookId, dueDate: dueDate }
            });
        })
    }

    // RETURN: DEVOLVER UM LIVRO
    // É o único "update" de um empréstimo: fecha o empréstimo e devolve o exemplar ao estoque.
    static async returnLoan (loanId: string): Promise<Loan> {
        return prisma.$transaction( async (tx) => {
            // ♻️ O empréstimo existe? Precisa dele também para ler o dueDate e o bookId.
            const loan = await tx.loan.findUnique({
                where: {
                    id: loanId
                }
            });
            if (!loan) throw new HttpError(404, "Emprestimo não encontrado!");

            const today = new Date();

            // Fecha o empréstimo, mas só se AINDA não foi devolvido (isReturned: false no where).
            // Mesmo truque do estoque: o banco testa e grava de uma vez, então duas devoluções
            // ao mesmo tempo (ex: clique duplo) não somam +2 no estoque.
            const closed = await tx.loan.updateMany({
                where: { id: loanId, isReturned: false },
                data: {
                    returnDate: today,  // data real da devolução
                    isReturned: true,
                    // Comparação já é um boolean: devolveu depois do prazo → true.
                    // Aqui o isLate é GRAVADO, porque vira um fato que não muda mais.
                    isLate: today > loan.dueDate
                }
            });
            // count 0 = o empréstimo já estava devolvido: 409, e a transaction desfaz tudo.
            if (closed.count === 0) throw new HttpError(409, "Esse emprestimo já foi devolvido")

            // O exemplar volta para a estante. increment = soma.
            await tx.book.update({
                where: { id: loan.bookId },
                data: { quantityAvailable: { increment: 1 } }
            });

            // updateMany só devolve a contagem, então busca o empréstimo já atualizado.
            // ...OrThrow lança erro em vez de devolver null (aqui ele com certeza existe).
            return tx.loan.findFirstOrThrow({ where: { id: loanId } });
        });
    }
}

export default LoansModelADM;
