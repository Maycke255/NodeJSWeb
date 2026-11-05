// FORMATO PADRÃO DAS RESPOSTAS DA API.
// Toda resposta tem "success"; quem consome a API checa ele primeiro.
//   sucesso → ok(dados, mensagem)    usado nos controllers
//   erro    → fail(mensagem, erros)  usado só no errorHandler

import type { User } from "../generated/prisma/client.js"; // tipo gerado pelo Prisma a partir do model User

// <T> = "genérico": o tipo dos dados é decidido em cada uso (PublicUser, Book[]...).
interface SuccessResponse <T> {
    success: true;
    data?: T;
    message?: string;
}

interface ErrorResponse {
    success: false,
    message?: string,
    errors?: Record<string, string[] | undefined> // erros por campo, vindos do Zod
}

// Uma resposta é uma OU outra. Checando "success", o TS sabe qual das duas é.
export type ApiResponse <T> = SuccessResponse <T> | ErrorResponse;

// Usuário que pode sair da API: tudo do User, menos a senha
export type PublicUser = Omit<User, "password">;

// Monta a resposta de sucesso. Ex: res.json(ok(user, "Usuario criado!"))
export const ok = <T>(data?: T, message?: string): SuccessResponse<T>  => ({
    success: true,
    data,
    message
});

// Monta a resposta de erro. Ex: res.status(400).json(fail("Dados invalidos", erros))
export const fail = (message?: string, errors?: ErrorResponse["errors"]): ErrorResponse => ({
    success: false,
    message,
    errors
});
