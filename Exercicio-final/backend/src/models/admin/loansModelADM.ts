import { prisma } from "../../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import { type Loan } from "../../generated/prisma/client.js";
import { HttpError } from "../../errors/HttpError.js"; // erro com status HTTP (404, 409...)
import { type CreateLoanInput, type UpdateLoanInput } from "../../schemas/loanSchema.js"

class LoansModelADM {
    static async create (userId: string, bookId: string): Promise<Loan> {
        return prisma.$transaction( async (tx) => {
            const book = await tx.book.findUnique({
                where: {
                    id: bookId
                }
            });
            if (!book) throw new HttpError(404, "Livro não encontrado!");

            const activeLoan = await tx.loan.findFirst({
                where: {
                    userId: userId, bookId: bookId, isReturned: false
                }
            });
            if (activeLoan) throw new HttpError(409, "Você já esta com um exemplar desse livro!");

            const taken = await tx.book.updateMany({
                where: {
                    id: bookId, quantityAvailable: { gt: 0 }
                },
                data: { quantityAvailable: { decrement: 1 } }
            });
            if (taken.count === 0) throw new HttpError(409, "Não há exemplares desse livro disponiveis no estoque!");

            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);

            return tx.loan.create({
                data: { userId: userId, bookId: bookId, dueDate: dueDate }
            });
        })
    }


}