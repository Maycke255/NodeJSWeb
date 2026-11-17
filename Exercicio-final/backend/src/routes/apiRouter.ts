// ROTAS: ligam "método HTTP + caminho" a uma função do controller.
// No server.ts este router é montado em "/api", então "/users" vira "/api/users".

import { Router } from "express";
import userControllerADM from "../controller/admin/userControllerADM.js"; // escrita: criar, atualizar, apagar
import UsersController from "../controller/userController.js";           // leitura: listar, buscar por id

import BookControllerADM from "../controller/admin/bookControllerADM.js"; // escrita
import BookController from "../controller/bookController.js";             // leitura

const apiRouter = Router(); // um "mini app" só com rotas, montado depois no server.ts

//USERS
// O caminho sempre começa com "/". Sem a barra, a rota nunca é encontrada.
// ":id" é um parâmetro: o valor da URL chega no controller em req.params.id.
// O mesmo caminho pode ter vários métodos: o Express escolhe a função pelo método HTTP.
apiRouter.get("/users", UsersController.getAllUsers);          // listar todos
apiRouter.post("/users", userControllerADM.createNewUser);   // criar
apiRouter.get("/users/:id", UsersController.getUserById);      // buscar um pelo id
apiRouter.put("/users/:id", userControllerADM.updateUser);   // atualizar
apiRouter.delete("/users/:id", userControllerADM.deleteUser); // apagar

//BOOKS
// Mesmo padrão dos usuários, no plural: /api/books
apiRouter.get("/books", BookController.getAllBooks);          // listar todos
apiRouter.post("/books", BookControllerADM.createNewBook);    // criar
apiRouter.get("/books/:id", BookController.getBookById);      // buscar um pelo id
apiRouter.put("/books/:id", BookControllerADM.updateBook);    // atualizar
apiRouter.delete("/books/:id", BookControllerADM.deleteBook); // apagar

//LOANS
// Rotas fixas (ex: "/loans/overdue") sempre ANTES de "/loans/:id",
// senão o Express entende "overdue" como um :id.

export default apiRouter;
