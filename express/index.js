const express = require('express');

const server = express();
const PORT = 3000;

/* Quando você cria uma rota no Express, o callback recebe dois objetos que representam os “dois lados” da conversa HTTP:
req (request / requisição): tudo o que chegou do cliente para o servidor (dados, URL, método, headers, parâmetros, body etc.).
res (response / resposta): tudo o que o servidor vai usar para responder ao cliente (status, headers e corpo da resposta).
Pense assim: req é a pergunta que o navegador (ou app) fez; res é a resposta que o servidor devolve. Usando o response, 
estamos enviando uma resposta (response) para a pagina assim que a rota e acionada */

/*Mesmo você não usando o request, ele existe e vem preenchido. Exemplos comuns:
req.method → "GET"
req.path → "/"
req.query → query string (ex.: /?a=1 vira { a: "1" })
req.params → parâmetros de rota (ex.: /users/:id)
req.headers → headers (User-Agent, Authorization etc.)
req.body → corpo (normalmente em POST/PUT/PATCH, com middleware)
res (o que você usa para responder)
res.status(200) → define status HTTP
res.send(...) → envia texto/HTML/objeto e finaliza a resposta
res.json(...) → envia JSON
res.set(...) → ajusta headers
Então sim: quando a rota é acionada, você envia uma resposta imediatamente (a menos que você faça alguma lógica assíncrona antes, tipo consultar banco). */

/* “Mas GET não é para obter dados que já existem?”Na web, “obter” não significa “pegar uma variável privada que já existe” como no get de uma classe.
No HTTP, GET significa: o cliente está pedindo uma representação de um recurso.Esse recurso pode ser:
uma página HTML (ex.: /)
um JSON vindo do banco (ex.: /produtos)
um texto simples (seu exemplo)
algo gerado na hora (dinâmico), como “hora atual”
até um resultado de cálculo
Ou seja: não precisa estar “pré-existindo” como um atributo privado. Pode ser montado na hora. O importante é: GET não deveria causar efeito colateral 
(não deveria “criar/alterar” algo no servidor como resultado daquela chamada).No seu caso, você não está “lançando dados”. Você está respondendo 
uma consulta do cliente: “me dê algo em /”. E você devolve um texto. */

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: <http://localhost>:${PORT}/`);
});

//req = request | res = response
server.get('/', (req, res) => {
    res.send('Servidor com express funcionando corretamente.\n Você esta na pagina inicial');
});

server.get('/clientes', (req, res) => {
    res.send('Você esta na pagina de clientes');
    res.end();
})