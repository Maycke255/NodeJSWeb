/* ​Crie uma aplicação Node.js usando Express e EJS para gerenciamento de coleções de listas de tarefas. 
A aplicação deverá ter as seguintes funcionalidades:

Uma página inicial de apresentação
Uma página exibindo todas as listas de tarefas
Criação de novas listas de tarefas (cada lista agrupa suas próprias tarefas)
Uma página para exibir as tarefas de uma lista específica
Uma forma de adicionar uma nova tarefa a uma lista
Formas de marcar como concluída e excluir uma tarefa (botão, checkbox, etc) */

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const router = require('./routes/routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Projeto rodando na porta: <http://localhost>:${PORT}/home`)
});

module.exports = app;