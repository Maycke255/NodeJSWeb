import { z } from "zod";

export const createBookSchema = z.object({
    title: z.
    string("Titulo do livro precisa ser obrigatorio!")
    .trim().min(2, "Nome do livro muito curto!")
    .max(150, "Nome do livro muito longo!"),

    author: z.
    string("O livro precisa ter um autor!")
    .trim()
    .min(2, "Nome do autor muito curto")
    .max(100, "Nome do autor e muito longo!"),

    quantityAvailable: z.
    int("Defina uma quantidade inicial de estoque para o livro!")
    .min(0, "O estoque não pode ser negativo")
    .max(10000, "Quantidade máxima permitida: 10.000!")
});

export const updateBookSchema = createBookSchema.partial();//Todos os campos opcionas para atualização

export const bookIdSchema = z.object({
    id: z.uuid("ID do livro invalido!")
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;