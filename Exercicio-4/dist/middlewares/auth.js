"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
//Middleware para verificar o token JWT e anexar ao usuario atual
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split('')[1];
    if (!token) {
        res.status(401).json({
            error: 'Acesso denegado. Nenhum token fornecido.'
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            error: 'Token invalido.'
        });
    }
};
exports.verifyToken = verifyToken;
//Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. Admin required.' });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
