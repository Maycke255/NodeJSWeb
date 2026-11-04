export class HttpError extends Error {
    status: number;

    constructor (status: number, message: string, success: boolean) {
        super(message);
        this.status = status;
        this.name = "HttpError";
    }
}