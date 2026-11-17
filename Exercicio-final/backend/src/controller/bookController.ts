// CONTROLLER (leitura de livros): rotas GET.
// Receita: valida o que chegou (Zod) → chama o model → responde com ok(...).
// Erros caem no catch e o next(error) entrega para o errorHandler.

import type { Handler } from "express"; // tipo de função de rota: (req, res, next) => ...
import BookModel from "../models/bookModel.js";
import { ok } from "../types/apiResponse.js"; // monta a resposta de sucesso padrão
import { bookIdSchema } from "../schemas/bookSchema.js" // valida o :id da URL (precisa ser UUID)

class BookController {
    // GET /api/books
    // Não tem nada para validar: a rota não recebe body nem parâmetro.
    static getAllBooks: Handler = async (req, res, next) => {
        try {
            const data = await BookModel.index(); // array de livros (pode ser [])
            // Lista vazia é um resultado normal (200), não erro: só avisa com uma mensagem.
            // Com livros, message fica undefined e não aparece no JSON.
            const message = data.length === 0 ? "Nenhum livro cadastrado no sistema!" : undefined;
            return res.status(200).json(ok(data, message));
        } catch (error) {
            next(error); // manda o erro para o errorHandler
        }
    }

    // GET /api/books/:id
    static getBookById: Handler = async (req, res, next) => {
        try {
            // ID inválido → ZodError → 400, sem nem consultar o banco.
            const { id } = bookIdSchema.parse(req.params);
            const data = await BookModel.indexById(id); // não achou → HttpError 404 vindo do model
            return res.status(200).json(ok(data));
        } catch (error) {
            next(error);
        }
    }
}

export default BookController;
