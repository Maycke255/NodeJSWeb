const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        'Meu cu': 'Bom dia'
    });
});

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Api rodando na porta:\n http://localhost:8000/`);
});