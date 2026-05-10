/* 
​Crie uma API usando Express que possua um sistema de autenticação usando JWT. Para isso, sua API deverá possuir as seguintes funcionalidades:

/ Rotas para registro e login, onde o usuário deverá ter os atributos nome, email, senha e papel, que poderá ser “Administrador” ou “Usuário Padrão”.

/ Novos usuários devem sempre ser cadastrados como “Usuários Padrão” e o array de usuários deve ser inicializado com um usuário “Administrador” já cadastrado.

/ O email dos usuários deverá ser único.

/ As rotas de registro e login devem ser capazes de lidar com erros comuns, como campos inválidos, credenciais incorretas e email já existente.

Deve ser feita a criação, decodificação e validação de um token JWT para autenticação dos usuários.

Uma rota que devolve uma mensagem de boas-vindas dinâmica. Caso não haja um usuário autenticado a mensagem o tratará como “Visitante”, caso contrário, o nome do 
usuário deve ser utilizado.

Rotas para gerenciar todos os usuários, mas que só podem ser acessadas por usuários administradores. Nelas deve ser possível criar outros usuários administradores, 
assim como ler e excluir qualquer usuário.

Obs.: Como essa API irá ter uma quantidade um pouco maior de rotas e funcionalidades, tente organizar o projeto de forma mais cuidadosa, utilizando diferentes arquivos 
e pastas.
*/

import express, { Express, Request, Response, urlencoded } from "express";
import router from '../backend/router/router';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(router);

const PORT: unknown = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Api rodando na porta: <http://localhost>:${PORT}`);
});