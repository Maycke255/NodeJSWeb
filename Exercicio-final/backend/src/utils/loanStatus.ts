// UTIL: regra do atraso, usada por todo lugar que LÊ empréstimos.
// O atraso de um empréstimo ativo não é guardado: é calculado na hora da leitura,
// então a resposta está sempre certa sem nada rodando em segundo plano.
import type { Loan } from "../generated/prisma/client.js";

// <T extends Loan> = genérico: aceita um Loan ou um Loan "com mais coisas" (book, user
// vindos do include) e devolve o MESMO tipo, sem o TypeScript perder esses campos.
export const withLateStatus = <T extends Loan>(loan: T): T => ({
    ...loan, // copia todos os campos do empréstimo
    // Devolvido → usa o isLate gravado na devolução (é um fato, não muda mais).
    // Ativo     → calcula agora: hoje já passou do prazo?
    isLate: loan.isReturned ? loan.isLate : new Date () > loan.dueDate
});
