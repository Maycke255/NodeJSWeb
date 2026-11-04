import { email, z } from "zod";

//Schema para validação
export const createUserSchema = z.object({
    name: z.string().min(2, "Nome muito curto!"),
    email: z.email("Email invalido!"),
    password: z.string().min(8, "Minimo 8 caracteres!"),

});

export const updateUserSchema = createUserSchema.partial();//Todos os campos opcionas para atualização
export const idSchema = z.object({
    id: z.uuid("ID invalido")
});

//Tipos gerados a partir dos esquemas, sem precisar de interface
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserinput = z.infer<typeof updateUserSchema>;