// MODEL (leitura): busca usuários no banco via Prisma.
// Devolve só dados; quem escolhe a mensagem de sucesso é o controller.
// Quando algo pedido não existe, lança HttpError e o errorHandler responde.

import { prisma } from "../lib/prisma.js"; // conexão única com o banco (lib/prisma.ts)
import { HttpError } from "../errors/HttpError.js"; // erro com status HTTP (404, 409...)
import type { PublicUser } from "../types/apiResponse.js"; // User sem a senha

// Campos que podem sair da API. Sem esse "select", o Prisma devolve TODAS as colunas,
// inclusive o hash da senha. O TypeScript não avisa, porque objeto com campo a mais
// ainda é aceito como PublicUser. Por isso: toda busca de usuário leva select: publicFields.
const publicFields = { id: true, name: true, email: true, createdAt: true };

class UsersModel {
    // GET ALL: devolve todos os usuários (só os campos públicos).
    // Promise<PublicUser[]> = devolve um array, que pode estar vazio.
    static async index (): Promise<PublicUser[]> {
        // findMany sem "where" = todos os registros da tabela. Nunca devolve null:
        // se não houver nada, devolve [].
        return await prisma.user.findMany({ select: publicFields });
    }

    // GET BY ID: devolve UM usuário ou lança 404.
    static async indexById (id: string): Promise<PublicUser> {
        // ♻️ PADRÃO REUTILIZÁVEL: "esse registro existe?"
        // findUnique busca por campo @id/@unique e devolve o registro ou null.
        // Não precisa checar antes se o banco tem usuários: se estiver vazio, também vem null.
        const user = await prisma.user.findUnique({ where: { id: id }, select: publicFields });
        if (!user) throw new HttpError(404, "Usuario não encontrado no sistema!"); // null → 404

        return user;
    }
}

export default UsersModel;