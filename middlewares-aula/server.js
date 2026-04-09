const express = require('express');
const session = require('express-session')
const router = require('./router/router.js');
const { middlewareA, middlewareB } = require('./middlewares/middlewaresAB.js');
const { upload } = require('./middlewares/middlewar.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.static('./src'));

// TESTES:

app.use(middlewareA);

app.get('/testeA', (req, res) => {
    console.log({ a: req.middlewareA, b: req.middlewareB });
    res.end();
});

app.get('/testeB', middlewareB, (req, res) => {
    console.log({ a: req.middlewareA, b: req.middlewareB });
    res.end();
});

app.post('/upload', upload.single('image'), (req, res) => {
    console.log({a: middlewareA, b: middlewareB});
    console.log(req.file, req.body);
    res.end();
});

//=====================================================================================
//=====================================================================================

//Configurando a sessão, no caso e a configuração de autorização por sessão
app.use(session({
    secret: 'palavra-chave-secrata', //hfhsajdnaskldfjadghakanfjsdhfuhajdkashf ->
    //A chave secreta que é utilizada para assinar os cookies do usuário.
    resave: false, //Um valor que indica se o middleware deve salvar a sessão após qualquer modificação.
    saveUninitialized: true,// -> Um valor que determina se a sessão deve ser salva mesmo que não haja modificações.
    cookie: { secure: false } //: Um objeto que define as configurações do cookie, como se o cookie deve ser seguro 
    // e se deve ser enviado apenas via HTTPS. Essas configurações são essenciais para garantir a segurança e 
    // a funcionalidade das sessões no Express.js, permitindo que o middleware armazene e rastreie 
    // informações do usuário de forma segura e eficiente. 
}));

app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Projeto rodando na porta: <http://localhost>:${PORT}/`)
});