import { z } from "zod";

//Schema para validação
export const createUserSchema = z.object({
    name: z.string("Nome obrigatorio!").trim().min(2, "Nome muito curto!"),
    email: z.email("Email invalido!").toLowerCase(),
    password: z.string("Senha obrigatoria!").min(8, "Minimo 8 caracteres!").max(72, "Maximo 72 caracteres!"),
});

export const updateUserSchema = createUserSchema.partial();//Todos os campos opcionas para atualização
export const userIdSchema = z.object({
    id: z.uuid("ID invalido")
});

//Tipos gerados a partir dos esquemas, sem precisar de interface
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;