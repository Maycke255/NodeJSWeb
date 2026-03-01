const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: <http://localhost>:${PORT}/`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..' , '/html/index.html'));
});