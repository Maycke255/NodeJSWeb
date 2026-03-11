// ===========================================================================
//ARQUIVO SERVER.JS (PRINCIPAL ENTRY POINT)
// ===========================================================================

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const router = require('./routes/routes');

// ===========================================================================
//INICIALIZAÇÃO DO APP
// ===========================================================================
const app = express();
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server rodando na porta: <http://localhost>:${PORT}/`);
});