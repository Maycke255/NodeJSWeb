/* ​Crie uma aplicação Node.js usando Express e EJS para cadastro e visualização de uma lista de e-mails de uma newsletter fictícia. 
A aplicação deve ter três páginas:

Página inicial para cadastro na newsletter.
Página de sucesso para a qual o usuário será redirecionado após se cadastrar.
Página para visualizar a lista de todos os e-mails cadastrados.
Ao preencher o formulário de inscrição o e-mail deverá ser salvo no backend em um array em memória e o usuário deverá ser redirecionado para 
a página de sucesso com uma mensagem indicando que seu e-mail foi cadastrado.

Desafio Extra: Crie na página de visualização dos e-mails cadastrados um botão que permite excluir um e-mail da lista. */

const express = require('express');
const path = require('path');
const crypto = require('crypto'); // Nativo do Node.js para gerar IDs

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'views')));

//===========================================================================================================================================
//Configurações iniciais para usar o ejs e indicar suas pastas
//===========================================================================================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'..', 'views'));

//===========================================================================================================================================
//Por padrão, para podermos acessar elementos do body, precisamos configurar o tipo de leitura que o express deve interpretar (pode vir json)
//então usamos esse urlencoded no inicio que já vem pre configurado
//===========================================================================================================================================
app.use(express.urlencoded({ extended: true }));

//===========================================================================================================================================
//Lista de emails para armazenamento
//===========================================================================================================================================
let newsletterList = [];

//===========================================================================================================================================
//Rotas:
//===========================================================================================================================================
app.get('/home', (req, res) => {
    res.render('index');
});

app.post('/register', (req, res) => {
    const newsletterID = crypto.randomUUID(); //gera ID unico
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;
    //Verificação rapida, caso checkbox marcado seja "on" vai retornar true, caso não, retorna false
    let optionChecked = req.body.option;

    if (optionChecked === 'on') {
        optionChecked = 'Sim';
    } else {
        optionChecked = 'Não';
    };

    newsletterList.push({ id: newsletterID, name: username, email: email, phone: phone, message: message, notifications: optionChecked });
    res.redirect('/sucess');
});

app.get('/sucess', (req, res) => {
    res.render('sucess');
});

app.get('/newsletter-registered', (req, res) => {
    res.render('newsletter-list', { newsletterList });
})

app.delete('/delete-newsletter/:id', (req, res) => {
    const ID = req.params.id;

    const newsletterIndex = newsletterList.findIndex((user) => user.id === ID);

    if (newsletterIndex !== -1) {
        // Se encontrou, remove 1 item da array naquela posição
        newsletterList.splice(newsletterIndex, 1); 
        // Responde para o frontend: "Deu tudo certo, código 200"
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } else {
        // Se não achou, responde com erro 404
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

//===========================================================================================================================================
//Inicialização do servidor
//===========================================================================================================================================
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: <http://localhost>:${PORT}/home`);
});