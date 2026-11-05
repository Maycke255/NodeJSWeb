import type { ErrorRequestHandler } from "express";
import { z, ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { HttpError } from "../errors/HttpError.js";
import { fail } from "../types/apiResponse.js";

/* “O dado veio no formato certo?” → o schema do Zod responde. Você escreve o schema uma vez e esquece.
“A regra do meu sistema permite isso?” → um if com throw new HttpError(...). Por exemplo: 
o usuário existe? O email já está em uso? O livro tem estoque? */

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json(fail("JSON invalido no corpo da requisicao!"));
        return;
    }

    
    if (err instanceof ZodError) {
        res.status(400).json(fail("Dados invalidos", z.flattenError(err).fieldErrors));
        return;
    }

    if (err instanceof HttpError) {
        res.status(err.status).json(fail(err.message));
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            res.status(409).json(fail("Email já cadastrado"));
            return;
        }

        if (err.code === "P2025") {
            res.status(404).json(fail("Registro não encontrado" ));
            return;
        }
    }

    console.error(err);
    res.status(500).json(fail("Erro interno no servidor!"));
}