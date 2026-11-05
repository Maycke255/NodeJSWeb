// CONTROLLER: a camada que lida com a requisição (req) e a resposta (res).
// Receita de todo método aqui:
//   1. valida o que chegou com o Zod (parse)
//   2. chama o model
//   3. responde com ok(...)
// Qualquer erro (do Zod, HttpError do model ou do Prisma) cai no catch
// e o next(error) entrega para o errorHandler, que monta a resposta de erro.

import UsersModelADM from "../../models/admin/userModelADM.js";
import type { Handler } from "express"; // tipo de função de rota: (req, res, next) => ...
import { createUserSchema, updateUserSchema, userIdSchema } from "../../schemas/userSchema.js";
import { ok } from "../../types/apiResponse.js"; // monta a resposta de sucesso padrão

class UsersControllerADM {
    // POST /api/users
    static createNewUser: Handler = async (req, res, next) => {
        try {
            // parse: se o body for inválido, lança ZodError (vira 400 no errorHandler).
            // Se for válido, devolve os dados limpos (trim, minúsculas) e já tipados,
            // e descarta campos extras que alguém tenha mandado no body.
            const data = createUserSchema.parse(req.body); //-> zod valida
            const newUser = await UsersModelADM.create(data); //-> model aplica as regras e salva
            return res.status(201).json(ok(newUser, "Usuario criado com sucesso")); // 201 = Created
        } catch (error) {
            next(error); // manda o erro para o errorHandler
        }
    }

    // PUT /api/users/:id
    static updateUser: Handler = async (req, res, next) => {
        try {
            // req.params = { id: "..." } (vem do ":id" da rota). Valida se é um UUID
            // e já desestrutura o id. ID inválido → ZodError → 400.
            const { id } = userIdSchema.parse(req.params); //-> zod valida
            const data = updateUserSchema.parse(req.body); //-> zod valida (todos os campos opcionais)
            const updateUser = await UsersModelADM.update(id, data); //-> model aplica as regras e salva
            return res.status(200).json(ok(updateUser, "Usuario atualizado com sucesso!")); // 200 = OK
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/users/:id
    static deleteUser: Handler = async (req, res, next) => {
        try {
            const { id } = userIdSchema.parse(req.params); //-> zod valida
            const deleteUser = await UsersModelADM.delete(id); //-> model aplica as regras e apaga
            // 200 e não 204: o 204 (No Content) descarta o corpo, e aqui eu quero devolver o JSON.
            return res.status(200).json(ok(deleteUser, "Usuario deletado com sucesso!"));
        } catch (error) {
            next(error);
        }
    }
}

export default UsersControllerADM;
