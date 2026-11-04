import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import { HttpError } from "../../errors/HttpError.js";
import type { CreateUserInput, UpdateUserinput } from "../../schemas/userSchema.js";

const publicFields = { id: true, name: true, email: true, createdAt: true };

class UsersModelADM {
    static async create (data: CreateUserInput) {
        
    }

    static async update (data: UpdateUserinput) {

    }

    static async delete(id: string) {

    }
}

export default UsersModelADM;