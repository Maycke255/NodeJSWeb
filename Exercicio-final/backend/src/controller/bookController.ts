import type { Handler } from "express"; // tipo de função de rota: (req, res, next) => ...
import BookModel from "../models/bookModel.js";
import { ok } from "../types/apiResponse.js"; // monta a resposta de sucesso padrão
import { bookIdSchema } from "../schemas/bookSchema.js" // valida o :id da URL (precisa ser UUID)

class BookController {
    static getAllBooks: Handler = async (req, res, next) => {
        try {
            const data = await BookModel.index();
            const message = data.length === 0 ? "Nenhum usuario cadastrado no sistema!" : undefined;
            return res.status(200).json(ok(data, message));
        } catch (error) {
            next(error);
        }
    }

    static getBookById: Handler = async (req, res, next) => {
        try {
            const { id } = bookIdSchema.parse(req.params);
            const data = await BookModel.indexById(id);
            return res.status(200).json(ok(data));
        } catch (error) {
            next(error);
        }
    }
}

export default BookController;