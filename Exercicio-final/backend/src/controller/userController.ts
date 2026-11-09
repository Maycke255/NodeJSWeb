// CONTROLLER (leitura): rotas GET de usuários.
// Receita: valida o que chegou (Zod) → chama o model → responde com ok(...).
// Erros caem no catch e o next(error) entrega para o errorHandler.

import type { Handler } from "express"; // tipo de função de rota: (req, res, next) => ...
import UsersModel from "../models/userModel.js";
import { ok } from "../types/apiResponse.js"; // monta a resposta de sucesso padrão
import { userIdSchema } from "../schemas/userSchema.js" // valida o :id da URL (precisa ser UUID)

class UsersController {
    // GET /api/users
    // Não tem nada para validar: a rota não recebe body nem parâmetro.
    static getAllUsers: Handler = async (req, res, next) => {
        try {
            const data = await UsersModel.index(); // array de usuários (pode ser [])
            // Operador ternário: condição ? valor_se_verdadeiro : valor_se_falso.
            // Lista vazia é um resultado normal (200), não erro: só avisa com uma mensagem.
            // Com usuários, message fica undefined e não aparece no JSON.
            // A mensagem fica aqui porque é parte da resposta HTTP; o model só traz os dados.
            const message = data.length === 0 ? "Nenhum usuario cadastrado no sistema!" : undefined;
            return res.status(200).json(ok(data, message)); // 200 = OK
        } catch (error) {
            next(error); // manda o erro para o errorHandler
        }
    }

    // GET /api/users/:id
    static getUserById: Handler = async (req, res, next) => {
        try {
            // req.params = { id: "..." }. Valida se é UUID e já desestrutura.
            // ID inválido → ZodError → 400, sem nem consultar o banco.
            const { id } = userIdSchema.parse(req.params);
            const data = await UsersModel.indexById(id); // não achou → HttpError 404 vindo do model
            return res.status(200).json(ok(data));
        } catch (error) {
            next(error);
        }
    }
}

export default UsersController;
