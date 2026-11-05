// HttpError: um Error comum que também carrega o status HTTP da resposta.
// Uso, em qualquer camada: throw new HttpError(404, "Usuario não encontrado!")
// O errorHandler reconhece com instanceof HttpError e responde com esse status e mensagem.
export class HttpError extends Error { // extends Error: herda message, stack etc.
    status: number; // o código HTTP (400, 404, 409...)

    constructor ( status: number, message: string) {
        super(message); // chama o construtor do Error, que guarda a mensagem em this.message
        this.status = status;
        this.name = "HttpError"; // nome que aparece nos logs no lugar de "Error"
    }
}
