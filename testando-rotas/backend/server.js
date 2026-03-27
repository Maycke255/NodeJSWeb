const express = require('express');
const router = require('./routes/routes.js');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '../frontend')));

app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Api rodando na porta:\n http://localhost:8000/`);
});