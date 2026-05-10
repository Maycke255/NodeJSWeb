"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthModel_1 = __importDefault(require("../model/AuthModel"));
const JWT_SECRET = process.env.JWT_SECRET;
class AuthController {
    static async welcome(req, res) {
        if (req.user) {
            return res.status(200).json({
                message: `Bem vindo, ${req.user.name}!`
            });
        }
        return res.status(200).json({
            message: 'Bem vindo visitante!'
        });
    }
    static async login(req, res) {
        const { email, password } = req.body;
        const result = await AuthModel_1.default.loginByEmail(email, password);
        // 1. Verificamos se o sucesso é falso OU se o data não veio
        if (!result.success || !result.data) {
            return res.status(401).json({
                success: false,
                message: result.message
            });
        }
        const { id, role, name, email: userEmail } = result.data;
        // Criando o Token (Payload contém id, nome e role)
        const token = jsonwebtoken_1.default.sign({ id, role, name, email: userEmail }, JWT_SECRET, { expiresIn: '8h' });
        return res.status(200).json({
            success: true,
            token,
            message: 'Login realizado com sucesso!'
        });
    }
}
exports.default = AuthController;
