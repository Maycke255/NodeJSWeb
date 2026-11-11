import { prisma } from "../../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import { type Loan } from "../../generated/prisma/client.js";
import { HttpError } from "../../errors/HttpError.js"; // erro com status HTTP (404, 409...)
import { type CreateLoanInput } from "../../schemas/loanSchema.js"

class LoansModelADM {
    static async create (data: CreateLoanInput): Promise<Loan> {
        
    }
}