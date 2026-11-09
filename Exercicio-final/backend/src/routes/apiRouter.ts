// ROTAS: ligam "método HTTP + caminho" a uma função do controller.
// No server.ts este router é montado em "/api", então "/users" vira "/api/users".

import { Router } from "express";
import userControllerADM from "../controller/admin/userControllerADM.js"; // escrita: criar, atualizar, apagar
import UsersController from "../controller/userController.js";           // leitura: listar, buscar por id

const apiRouter = Router(); // um "mini app" só com rotas, montado depois no server.ts

// O caminho sempre começa com "/". Sem a barra, a rota nunca é encontrada.
// ":id" é um parâmetro: o valor da URL chega no controller em req.params.id.
// O mesmo caminho pode ter vários métodos: o Express escolhe a função pelo método HTTP.
apiRouter.get("/users", UsersController.getAllUsers);          // listar todos
apiRouter.post("/users", userControllerADM.createNewUser);   // criar
apiRouter.get("/users/:id", UsersController.getUserById);      // buscar um pelo id
apiRouter.put("/users/:id", userControllerADM.updateUser);   // atualizar
apiRouter.delete("/users/:id", userControllerADM.deleteUser); // apagar

export default apiRouter;
