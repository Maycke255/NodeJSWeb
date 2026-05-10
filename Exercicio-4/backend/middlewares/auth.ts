import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
    id: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET!;

//Middleware para verificar o token JWT e anexar ao usuario atual
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');

    const token = authHeader && authHeader.split('')[1];

    if (!token) {
        res.status(401).json({
            error: 'Acesso denegado. Nenhum token fornecido.'
        });
    }

    try {
        const decoded = jwt.verify(token as string, JWT_SECRET) as unknown as UserPayload;

        (req as Request).user = decoded;
        next();
    } catch (error: any) {
        res.status(401).json({
            error: 'Token invalido.'
        })
    }
}

//Middleware para verificar se o usuário é administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. Admin required.' });
        return;
    }
    next();
} 