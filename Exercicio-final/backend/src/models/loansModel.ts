// MODEL (leitura de empréstimos): busca empréstimos no banco via Prisma.
// Todo empréstimo lido passa pelo withLateStatus, que calcula na hora se um
// empréstimo ATIVO está atrasado. Por isso nada precisa rodar em segundo plano.

import { prisma } from "../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import { HttpError } from "../errors/HttpError.js"; // erro com status HTTP (404, 409...)
import { withLateStatus } from "../utils/loanStatus.js"; // regra do atraso (utils/loanStatus.ts)

class LoansModel {
    // GET ALL: todos os empréstimos, com o livro e o usuário de cada um.
    // Sem ": Promise<...>" de propósito: com o include, o TypeScript monta sozinho
    // um tipo que já tem book e user dentro (Loan puro não teria).
    static async index () {
        const loans = await prisma.loan.findMany({ orderBy: { dueDate: "asc" },  // prazo mais próximo primeiro
        // include = traz junto os dados das tabelas relacionadas (o "JOIN").
        // O select dentro escolhe só alguns campos de cada uma.
        include: {
            book: { select: { title: true, author: true } },
            user: { select: { name: true, email: true } }, // sem password: NUNCA use user: true aqui
        }});
        // .map aplica o withLateStatus em cada empréstimo da lista
        return loans.map(withLateStatus);
    }

    // GET BY ID: um empréstimo, com livro e usuário, ou 404.
    static async indexById (loanId: string) {
        const loan = await prisma.loan.findUnique({
            where: { id: loanId },
            include: {
            book: { select: { title: true, author: true } },
            user: { select: { name: true, email: true } }, // sem password
        }
        });
        if (!loan) throw new HttpError(404, "Emprestimo não encontrado!"); // null → 404
        return withLateStatus(loan); // mesma regra do index: um lugar só para mudar
    }
}

export default LoansModel;
