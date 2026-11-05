import UsersModelADM from "../../models/admin/userModelADM.js";
import type { Handler } from "express";
import { createUserSchema, updateUserSchema, userIdSchema } from "../../schemas/userSchema.js";
import { ok } from "../../types/apiResponse.js";

class UsersControllerADM {
    static createNewUser: Handler = async (req, res, next) => {
        try {
            const data = createUserSchema.parse(req.body); //-> zod valida
            const newUser = await UsersModelADM.create(data); //-> prisma valida
            return res.status(201).json(ok(newUser, "Usuario criado com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    static updateUser: Handler = async (req, res, next) => {
        try {
            const { id } = userIdSchema.parse(req.params); //-> zod valida
            const data = updateUserSchema.parse(req.body); //-> zod valida
            const updateUser = await UsersModelADM.update(id, data); //-> prisma valida
            return res.status(200).json(ok(updateUser, "Usuario atualizado com sucesso!"));
        } catch (error) {
            next(error);
        }
    }

    static deleteUser: Handler = async (req, res, next) => {
        try {
            const { id } = userIdSchema.parse(req.params); //-> zod valida
            const deleteUser = await UsersModelADM.delete(id); //-> prisma valida
            return res.status(200).json(ok(deleteUser, "Usuario deletado com sucesso!"));
        } catch (error) {
            next(error);
        }
    }
}

export default UsersControllerADM;