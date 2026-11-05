// ROTAS: ligam "método HTTP + caminho" a uma função do controller.
// No server.ts este router é montado em "/api", então "/users" vira "/api/users".

import { Router } from "express";
import userControllerADM from "../controller/admin/userControllerADM.js";

const apiRouter = Router(); // um "mini app" só com rotas, montado depois no server.ts

// O caminho sempre começa com "/". Sem a barra, a rota nunca é encontrada.
// ":id" é um parâmetro: o valor da URL chega no controller em req.params.id.
apiRouter.post("/users", userControllerADM.createNewUser);   // criar
apiRouter.put("/users/:id", userControllerADM.updateUser);   // atualizar
apiRouter.delete("/users/:id", userControllerADM.deleteUser); // apagar

export default apiRouter;
