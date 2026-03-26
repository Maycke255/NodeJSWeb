const express = require('express');
const app = express();
const router = require('./routes/routes.js')
app.use(express.json());

app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Api rodando na porta:\n http://localhost:8000/`);
});