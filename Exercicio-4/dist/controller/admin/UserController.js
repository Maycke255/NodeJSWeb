"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthModel_1 = __importDefault(require("../../model/AuthModel"));
class ValidationUtils {
    static isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    static isValidPassword(password) {
        // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    }
}
class UserController {
    static async index(req, res) {
        try {
            const result = await AuthModel_1.default.findAll();
            if (result.success) {
                return res.status(200).json(result);
            }
            else {
                return res.status(400).json(result);
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Erro: ${error.message}`
            });
        }
    }
    static async indexById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: 'ID de usuario invalido'
                });
            }
            const result = await AuthModel_1.default.findUserById(Number(id));
            if (result.success) {
                return res.status(200).json(result);
            }
            else {
                return res.status(400).json(result);
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Erro: ${error.message}`
            });
        }
    }
    static async save(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!email || !name || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Informações invalidas!'
                });
            }
            const emailTest = ValidationUtils.isValidEmail(email);
            if (emailTest === false) {
                return res.status(400).json({ success: false, message: 'Formato de e-mail inválido.' });
            }
            const passwordTest = ValidationUtils.isValidPassword(password);
            if (passwordTest === false) {
                return res.status(400).json({
                    success: false, message: 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
                });
            }
            const result = await AuthModel_1.default.createNewUser(name, email, password);
            if (result.success) {
                return res.status(200).json(result);
            }
            else {
                return res.status(400).json(result);
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Erro: ${error.message}`
            });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: 'ID de usuario invalido'
                });
            }
            if (email !== undefined) {
                const emailTest = ValidationUtils.isValidEmail(email);
                if (emailTest === false) {
                    return { success: false, message: 'Formato de e-mail inválido.' };
                }
            }
            if (password !== undefined) {
                const passwordTest = ValidationUtils.isValidPassword(password);
                if (passwordTest == false) {
                    return {
                        success: false, message: 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
                    };
                }
            }
            const result = await AuthModel_1.default.updateUser(Number(id), name, email, password);
            if (result.success) {
                return res.status(200).json(result);
            }
            else {
                return res.status(400).json(result);
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Erro: ${error.message}`
            });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: 'ID de usuario invalido'
                });
            }
            const result = await AuthModel_1.default.deleteUser(Number(id));
            if (result.success) {
                return res.status(200).json(result);
            }
            else {
                return res.status(400).json(result);
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Erro: ${error.message}`
            });
        }
    }
}
exports.default = UserController;
