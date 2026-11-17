// SCHEMAS DO ZOD (livros): as regras de formato dos dados que CHEGAM na API.
// Uso no controller: schema.parse(dados)
//   - inválido → lança ZodError (o errorHandler responde 400)
//   - válido   → devolve os dados limpos e tipados
import { z } from "zod";

// A mensagem em cada função é o texto que aparece quando aquela regra falha.
export const createBookSchema = z.object({
    // z.string("...") = mensagem para quando o campo não vem ou não é texto.
    // trim() antes do min(2): espaços sobrando não contam e não criam livros "repetidos".
    // Sem toLowerCase de propósito: o título aparece na tela como foi escrito.
    title: z.
    string("Titulo do livro precisa ser obrigatorio!")
    .trim().min(2, "Nome do livro muito curto!")
    .max(150, "Nome do livro muito longo!"),

    author: z.
    string("O livro precisa ter um autor!")
    .trim()
    .min(2, "Nome do autor muito curto")
    .max(100, "Nome do autor e muito longo!"),

    // z.int = número inteiro (3 passa, 3.5 não). Recusa texto como "3".
    quantityAvailable: z.
    int("Defina uma quantidade inicial de estoque para o livro!")
    .min(0, "O estoque não pode ser negativo")
    .max(10000, "Quantidade máxima permitida: 10.000!")
});

export const updateBookSchema = createBookSchema.partial();//Todos os campos opcionas para atualização

// Valida o req.params inteiro ({ id: "..." }). UUID porque o schema.prisma usa @default(uuid()).
export const bookIdSchema = z.object({
    id: z.uuid("ID do livro invalido!")
});

// z.infer lê o schema e cria o tipo TypeScript equivalente. Mudou o schema, o tipo muda junto.
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
