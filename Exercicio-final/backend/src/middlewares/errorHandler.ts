// MIDDLEWARE DE ERRO: o único lugar que monta as respostas de erro da API.
// Ele não lança erro: ele RECEBE todo erro lançado nas rotas (throw ou next(error))
// e decide o status e a mensagem. Por isso o fail() só é usado aqui.
// Precisa ser registrado por último no server.ts.

import type { ErrorRequestHandler } from "express"; // tipo de middleware de erro: (err, req, res, next)
import { z, ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js"; // import normal (não "type"): o instanceof precisa da classe
import { HttpError } from "../errors/HttpError.js";
import { fail } from "../types/apiResponse.js"; // monta a resposta de erro padrão

/* “O dado veio no formato certo?” → o schema do Zod responde. Você escreve o schema uma vez e esquece.
“A regra do meu sistema permite isso?” → um if com throw new HttpError(...). Por exemplo:
o usuário existe? O email já está em uso? O livro tem estoque? */

// Os 4 parâmetros são obrigatórios: é assim que o Express sabe que este é um middleware de erro.
// Cada if testa um tipo de erro com instanceof ("este erro é dessa classe?"),
// responde e dá return, para não cair nos ifs de baixo.
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // JSON mal escrito no body: o express.json() falha antes de chegar no controller.
    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json(fail("JSON invalido no corpo da requisicao!"));
        return;
    }


    // Falha no parse do Zod: 400 com os erros de cada campo.
    // flattenError transforma em { campo: ["mensagem", ...] }.
    if (err instanceof ZodError) {
        res.status(400).json(fail("Dados invalidos", z.flattenError(err).fieldErrors));
        return;
    }

    // Regra de negócio que lancei com throw new HttpError(status, mensagem).
    if (err instanceof HttpError) {
        res.status(err.status).json(fail(err.message));
        return;
    }

    // Erros que o próprio banco recusou, identificados por código:
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: violou um @unique (ex: e-mail repetido).
        if (err.code === "P2002") {
            res.status(409).json(fail("Email já cadastrado"));
            return;
        }

        // P2025: registro não encontrado no update/delete.
        if (err.code === "P2025") {
            res.status(404).json(fail("Registro não encontrado" ));
            return;
        }
    }

    // Qualquer outro erro é inesperado: registra no terminal (para eu investigar)
    // e responde uma mensagem genérica, sem expor detalhes internos para quem chamou a API.
    console.error(err);
    res.status(500).json(fail("Erro interno no servidor!"));
}
