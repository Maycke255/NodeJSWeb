const express = require('express');
const path = require('path');

const app = express();

//Definimos isso apenas uma vez, e apenas uma definição de configurações, onde dizemos que queremos substituir a configuração presente na view engine para ejs
app.set('view engine', 'ejs');
//A segui rdizemos onde os nosso assets estão, no caso nosso arquivo ejs
app.set('views', path.join(__dirname, '..', 'public'));

app.get('/', (req, res) => {
    //Podemos também definir variaveis para poder enviar para o arquivo ejs, parecido com import e export do ESmodules
    const title = 'Vc e yag';
    const content = 'Mensagem via JS funcionando!';

    //Aqui vamos renderizar, apenas dizemos o nome do arquivo qual deve receber as variaveis, sem extensão, em seguida as enviamos entre chaves { }
    res.render('index', { title, content });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em: <http://localhost>:${PORT}`);
});

