import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/HttpError.js";
import type { CreateUserInput, UpdateUserInput } from "../schemas/userSchema.js";
import { success } from "zod";

const publicFields = { id: true, name: true, email: true, createdAt: true };

class UsersModel {
    static async getAll () {
        const result = await prisma.user.findMany({ select: publicFields });

        if (result.length === 0) {
            return { success: true, data: null, message: "Nenhum usuario cadastrado!" }
        }
    }

    static async getById (id: string) {

    }
}

export default UsersModel;