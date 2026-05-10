import express, { Router, Request, Response } from "express";
import AuthController from "../controller/AuthController";
import UserController from "../controller/admin/UserController";
import { verifyToken, isAdmin } from "../middlewares/auth";

const router: Router = express.Router();

// Rota de Boas-vindas (usa verifyToken mas não bloqueia se não houver)
router.get('/welcome', verifyToken, AuthController.welcome);

//Login
router.post('/login', AuthController.login);

//Rotas administrativas
//Aqui aplicamos verifyToken E isAdmin para garantir segurança máxima
router.get('/admin/users', verifyToken, isAdmin, UserController.index);
router.get('/admin/users/:id', verifyToken, isAdmin, UserController.indexById);
router.post('/admin/users', verifyToken, isAdmin, UserController.save);
router.put('/admin/users/:id', verifyToken, isAdmin, UserController.update);
router.delete('/admin/users/:id', verifyToken, isAdmin, UserController.delete);

export default router ;