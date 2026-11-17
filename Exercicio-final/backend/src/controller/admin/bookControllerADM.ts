// CONTROLLER (escrita de livros): criar, atualizar e apagar.
// Receita de todo método aqui:
//   1. valida o que chegou com o Zod (parse)
//   2. chama o model
//   3. responde com ok(...)
// Qualquer erro (do Zod, HttpError do model ou do Prisma) cai no catch
// e o next(error) entrega para o errorHandler, que monta a resposta de erro.

import BookModelADM from "../../models/admin/booksModelADM.js";
import type { Handler } from "express"; // tipo de função de rota: (req, res, next) => ...
import { ok } from "../../types/apiResponse.js"; // monta a resposta de sucesso padrão
import { createBookSchema, updateBookSchema, bookIdSchema } from "../../schemas/bookSchema.js";

class BookControllerADM {
    // POST /api/books
    static createNewBook: Handler = async (req, res, next) => {
        try {
            // Inválido → ZodError → 400. Válido → dados limpos (trim) e tipados,
            // sem campos extras que alguém tenha mandado no body.
            const data = createBookSchema.parse(req.body);
            const newBook = await BookModelADM.create(data); // model checa livro repetido e salva

            return res.status(201).json(ok(newBook, "Livro criado com sucesso!"));    // 201 = Created
        } catch (error) {
            next(error); // manda o erro para o errorHandler
        }
    }

    // PUT /api/books/:id
    static updateBook: Handler = async (req, res, next) => {
        try {
            const { id } = bookIdSchema.parse(req.params); // valida se o :id é UUID e já desestrutura
            const data = updateBookSchema.parse(req.body); // todos os campos opcionais
            const updateBook = await BookModelADM.update(id, data); // model checa se existe e se repete
            return res.status(200).json(ok(updateBook, "Livro atualizado com sucesso!")); // 200 = OK
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/books/:id
    static deleteBook: Handler = async (req, res, next) => {
        try {
            const { id } = bookIdSchema.parse(req.params);
            const deleteBook = await BookModelADM.delete(id); // bloqueia se o livro tiver empréstimos
            // 200 e não 204: o 204 (No Content) descarta o corpo, e aqui eu quero devolver o JSON.
            return res.status(200).json(ok(deleteBook, "Livro excluido com sucesso!"));
        } catch (error) {
            next(error);
        }
    }
}

export default BookControllerADM;
