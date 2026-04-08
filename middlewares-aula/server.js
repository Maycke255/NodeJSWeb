const express = require('express');
const router = require('./router/router.js')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Projeto rodando na porta: <http://localhost>:${PORT}`)
});