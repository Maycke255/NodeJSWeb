"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controller/AuthController"));
const UserController_1 = __importDefault(require("../controller/admin/UserController"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Rota de Boas-vindas (usa verifyToken mas não bloqueia se não houver)
router.get('/welcome', auth_1.verifyToken, AuthController_1.default.welcome);
//Login
router.post('/login', AuthController_1.default.login);
//Rotas administrativas
//Aqui aplicamos verifyToken E isAdmin para garantir segurança máxima
router.get('/admin/users', auth_1.verifyToken, auth_1.isAdmin, UserController_1.default.index);
router.get('/admin/users/:id', auth_1.verifyToken, auth_1.isAdmin, UserController_1.default.indexById);
router.post('/admin/users', auth_1.verifyToken, auth_1.isAdmin, UserController_1.default.save);
router.put('/admin/users/:id', auth_1.verifyToken, auth_1.isAdmin, UserController_1.default.update);
router.delete('/admin/users/:id', auth_1.verifyToken, auth_1.isAdmin, UserController_1.default.delete);
exports.default = router;
