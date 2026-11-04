import type { User } from "../generated/prisma/client.js";

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

export type ApiResponse <T> = SuccessResponse <T> | ErrorResponse;

// Usuário que pode sair da API: tudo do User, menos a senha
export type PublicUser = Omit<User, "password">;

export const ok = <T>(data?: T, message?: string): SuccessResponse<T>  => ({
    success: true,
    data,
    message
});

export const fail = (message?: string, errors?: ErrorResponse["errors"]): ErrorResponse => ({
    success: false,
    message,
    errors
});