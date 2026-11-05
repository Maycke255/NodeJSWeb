// MODEL: a única camada que conversa com o banco (via Prisma).
// Recebe dados JÁ validados pelo Zod no controller e aplica as regras de negócio
// (e-mail repetido, usuário existe?, tem empréstimos?). Quando uma regra falha,
// lança um HttpError com throw, e ele sobe sozinho até o errorHandler.

import { prisma } from "../../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import bcrypt from "bcrypt"; // gera o hash da senha (nunca salve a senha pura)
import { HttpError } from "../../errors/HttpError.js"; // erro com status HTTP (404, 409...)
import { type CreateUserInput, type UpdateUserInput } from "../../schemas/userSchema.js"; // tipos gerados pelo Zod
import type { PublicUser } from "../../types/apiResponse.js"; // User sem a senha

// Campos que podem sair da API. Usado no "select" do Prisma: só vem o que está aqui,
// então a senha nunca é devolvida (e um campo novo no banco não vaza sem querer).
const publicFields = { id: true, name: true, email: true, createdAt: true };

class UsersModelADM {
    // CREATE: CRIAR USUARIO
    // static = chamo direto pela classe (UsersModelADM.create(...)), sem precisar de "new".
    // Promise<PublicUser> = a função é async e, quando terminar, devolve um usuário sem senha.
    static async create (data: CreateUserInput): Promise<PublicUser> {
            // ♻️ PADRÃO REUTILIZÁVEL: "esse valor já existe no banco?"
            // findUnique busca por um campo @id ou @unique e devolve o registro ou null.
            // Serve para qualquer campo único: email, id, cpf, username...
            const emailInUse = await prisma.user.findUnique({
                where: {
                    email: data.email
                }
            });

            // Se achou (não é null), o e-mail já está em uso: 409 Conflict.
            // O throw interrompe a função aqui; nada abaixo é executado.
            if (emailInUse) throw new HttpError(409, `O email "${data.email}" já esta cadastrado no sistema!`);

            // Gera o hash da senha. O 10 é o "custo": quanto maior, mais seguro e mais lento.
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // Cria o usuário. O spread (...data) copia name, email e password,
            // e o "password: hashedPassword" logo depois substitui a senha pura pelo hash.
            return await prisma.user.create({
                data: { ...data, password: hashedPassword },
                select: publicFields // devolve só os campos públicos
            });
    }

    // UPDATE: ATUALIZAR SOMENTE OS DADOS ENVIADOS
    // data vem do updateUserSchema (.partial()), então todos os campos são opcionais:
    // o que não foi enviado não aparece no objeto e o Prisma não mexe nele.
    static async update (id: string, data: UpdateUserInput): Promise<PublicUser> {
        // ♻️ PADRÃO REUTILIZÁVEL: "esse usuário existe?"
        // Mesma ideia do create, mas buscando pelo id.
        const userIdExist = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        // Repare no "!": se NÃO achou (é null), responde 404 Not Found.
        if (!userIdExist) throw new HttpError(404, `O usuario solicitado não existe!`);

        // Só gera o hash se uma nova senha foi enviada.
        // Cria um objeto novo com tudo o que veio + a senha trocada pelo hash.
        if (data.password) {
            data = {
                ...data,
                password: await bcrypt.hash(data.password, 10)
            }
        }

        // Atualiza só os campos que vieram em "data".
        // Se o novo e-mail já for de outra pessoa, o Prisma lança o erro P2002,
        // e o errorHandler transforma em 409.
        return await prisma.user.update({
            where: {
                id: id
            },
            data,
            select: publicFields
        });
    }

    //DELETE: DELETAR USUARIO
    // Devolve o usuário apagado, para o controller poder montar a mensagem com o nome.
    static async delete (id: string): Promise<PublicUser> {
        // ♻️ Mesmo padrão do update: o usuário existe?
        const userIdExist = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if (!userIdExist) throw new HttpError(404, `O usuario solicitado não existe!`);

        // ♻️ PADRÃO REUTILIZÁVEL: "existe algum registro ligado a este?"
        // count devolve QUANTOS registros batem com o filtro (aqui: empréstimos deste usuário).
        // Necessário porque a migration criou a FK com ON DELETE RESTRICT: o banco
        // recusaria apagar um usuário com empréstimos e daria erro 500.
        const loans = await prisma.loan.count({
            where: { userId: id }
        });
        if (loans > 0) throw new HttpError(409, "Não é possivel excluir um usuario com emprestimos registrados!")

        // Apaga e devolve o registro apagado (só os campos públicos).
        return await prisma.user.delete({
            where: {
                id
            },
            select: publicFields
        });
    }
}

export default UsersModelADM;
