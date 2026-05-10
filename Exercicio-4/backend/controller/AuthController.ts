import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UsersModel from '../model/AuthModel';

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
    static async welcome (req: Request, res: Response) {
        if (req.user) {
            return res.status(200).json({
                message: `Bem vindo, ${req.user.name}!`
            });
        }
        return res.status(200).json({
            message: 'Bem vindo visitante!'
        });
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const result = await UsersModel.loginByEmail(email, password);

        // 1. Verificamos se o sucesso é falso OU se o data não veio
        if (!result.success || !result.data) {
            return res.status(401).json({
                success: false,
                message: result.message
            })
        }

        const { id, role, name, email: userEmail } = result.data;



        // Criando o Token (Payload contém id, nome e role)
        const token = jwt.sign(
            { id, role, name, email: userEmail },
            JWT_SECRET!,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            success: true,
            token,
            message: 'Login realizado com sucesso!'
        })
    }
}

export default AuthController;