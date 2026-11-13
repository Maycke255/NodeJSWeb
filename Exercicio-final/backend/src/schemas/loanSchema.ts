// SCHEMAS DO ZOD (empréstimos): só validam o que o CLIENTE envia.
// Quase todos os campos do Loan são preenchidos pelo servidor, nunca pelo body:
//   - userId     → do usuário logado (req.user, quando o ensureAuth existir)
//   - createdAt  → @default(now()) no schema.prisma: a data do empréstimo
//   - dueDate   -> calculada no model (hoje + 14 dias)
//   - returnDate → data de retorno do livro, so e preenchida quando o livro retorna
//   - isReturned / isLate → @default(false), mudam só na devolução
// Se o cliente pudesse mandar esses campos, ele poderia escolher a própria data
// de devolução ou se marcar como "não atrasado".
import { z } from "zod";

// POST /api/loans → body: { "bookId": "..." }
// O cliente só diz QUAL livro quer. Campos extras no body são descartados pelo parse.
export const createLoanSchema = z.object({
    bookId: z.uuid("ID do livro invalido!"),
    userId: z.uuid("ID do usuario invalido!"),
});

export const updateLoanSchema = createLoanSchema.partial();

// GET /api/loans/:id e POST /api/loans/:id/return → valida o req.params ({ id: "..." })
export const loanIdSchema = z.object({
    id: z.uuid("ID do emprestimo invalido!"),
});

// Tipo gerado a partir do schema, sem precisar de interface
export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type UpdateLoanInput = z.infer<typeof updateLoanSchema>;