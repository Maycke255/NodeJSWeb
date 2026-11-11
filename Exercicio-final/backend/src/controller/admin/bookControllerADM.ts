import BookModelADM from "../../models/admin/booksModelADM.js";
import type { Handler } from "express"; // tipo de função de rota: (req, res, next) => ...
import { ok } from "../../types/apiResponse.js"; // monta a resposta de sucesso padrão
import { createBookSchema, updateBookSchema, bookIdSchema } from "../../schemas/bookSchema.js";

class BookControllerADM {
    static createNewBook: Handler = async (req, res, next) => {
        try {
            const data = createBookSchema.parse(req.body);
            const newBook = await BookModelADM.create(data);

            return res.status(201).json(ok(newBook, "Livro criado com sucesso!"));   
        } catch (error) {
            next(error);
        }
    }

    static updateBook: Handler = async (req, res, next) => {
        try {
            const { id } = bookIdSchema.parse(req.params);
            const data = updateBookSchema.parse(req.body);
            const updateBook = await BookModelADM.update(id, data);
            return res.status(200).json(ok(updateBook, "Livro atualizado com sucesso!"));
        } catch (error) {
            next(error);
        }
    }

    static deleteBook: Handler = async (req, res, next) => {
        try {
            const { id } = bookIdSchema.parse(req.params);
            const deleteBook = await BookModelADM.delete(id);
            return res.status(200).json(ok(deleteBook, "Livro excluido com sucesso!"));
        } catch (error) {
            next(error);
        }
    }
}

export default BookControllerADM;