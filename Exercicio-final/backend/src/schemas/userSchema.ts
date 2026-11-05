// SCHEMAS DO ZOD: as regras de formato dos dados que CHEGAM na API.
// O TypeScript só confere os tipos antes de rodar; o Zod confere de verdade,
// com o app rodando. Uso no controller: schema.parse(dados)
//   - inválido → lança ZodError (o errorHandler responde 400)
//   - válido   → devolve os dados limpos e tipados
import { z } from "zod";

//Schema para validação
// A mensagem em cada função é o texto que aparece quando aquela regra falha.
export const createUserSchema = z.object({
    // z.string("...") = mensagem para quando o campo não vem ou não é texto.
    // trim() tira os espaços das pontas antes do min(2): "   " não passa.
    name: z.string("Nome obrigatorio!").trim().min(2, "Nome muito curto!"),
    // toLowerCase(): "Ana@Email.com" vira "ana@email.com", então não existem duas contas com o mesmo e-mail.
    email: z.email("Email invalido!").toLowerCase(),
    // max(72): o bcrypt só considera os primeiros 72 bytes da senha.
    password: z.string("Senha obrigatoria!").min(8, "Minimo 8 caracteres!").max(72, "Maximo 72 caracteres!"),
});

export const updateUserSchema = createUserSchema.partial();//Todos os campos opcionas para atualização
// Valida o req.params inteiro ({ id: "..." }). O id é um UUID porque o schema.prisma usa @default(uuid()).
export const userIdSchema = z.object({
    id: z.uuid("ID invalido")
});

//Tipos gerados a partir dos esquemas, sem precisar de interface
// z.infer lê o schema e cria o tipo TypeScript equivalente. Mudou o schema, o tipo muda junto.
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
