/* ​Crie uma aplicação Node.js usando Express para gerenciamento de playlists de música. A aplicação deverá ter atender os seguintes requisitos:

Uma playlist deve ter, pelo menos, nome e uma lista de tags para classificá-la.
Uma playlist deve ter uma lista de músicas, onde cada música deve ter, no mínimo, título, ano, artista e álbum.
Deve ser possível obter uma lista de todas as playlists existentes, bem como uma playlist individualmente.
Deve ser possível cadastrar novas playlists, com ou sem músicas nela.
Deve ser possível atualizar o nome e a lista de tags de uma playlist.
Deve ser possível excluir uma playlist.
Deve ser possível adicionar e remover músicas em uma playlist. */
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Projeto rodando na porta: <http://localhost>:${PORT}/home`)
});

module.exports = app;