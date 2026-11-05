import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import { HttpError } from "../../errors/HttpError.js";
import { type CreateUserInput, type UpdateUserInput } from "../../schemas/userSchema.js";
import type { PublicUser } from "../../types/apiResponse.js";

const publicFields = { id: true, name: true, email: true, createdAt: true };

class UsersModelADM {
    // CREATE: CRIAR USUARIO
    static async create (data: CreateUserInput): Promise<PublicUser> {
            const emailInUse = await prisma.user.findUnique({
                where: {
                    email: data.email
                }
            });

            if (emailInUse) throw new HttpError(409, `O email "${data.email}" já esta cadastrado no sistema!`);

            const hashedPassword = await bcrypt.hash(data.password, 10);

            return await prisma.user.create({
                data: { ...data, password: hashedPassword },
                select: publicFields
            });
    }

    // UPDATE: ATUALIZAR SOMENTE DADOS REQUISITATOS
    static async update (id: string, data: UpdateUserInput): Promise<PublicUser> {
        const userIdExist = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if (!userIdExist) throw new HttpError(404, `O usuario solicitado não existe!`);

        if (data.password) {
            data = {
                ...data,
                password: await bcrypt.hash(data.password, 10)
            }
        }

        return await prisma.user.update({
            where: {
                id: id
            },
            data,
            select: publicFields
        });
    }

    //DELETE: DELETAR USUARIO
    static async delete (id: string): Promise<PublicUser> {
        const userIdExist = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if (!userIdExist) throw new HttpError(404, `O usuario solicitado não existe!`);

        const loans = await prisma.loan.count({
            where: { userId: id }
        });
        if (loans > 0) throw new HttpError(409, "Não é possivel excluir um usuario com emprestimos registrados!")

        return await prisma.user.delete({
            where: {
                id
            },
            select: publicFields
        });
    }
}

export default UsersModelADM;