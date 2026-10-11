# Inicializaação

## Vamos tratar aqui coisas simples, como instalação e inicialização do express para o uso do typescript

**V - Beta 0.1**

#### 1
- Primeiro inicializamos o projeto com npm como de costume para instalação de futuros pacotes: npm init -y
- Depois instalamos o express como dependencia comum: npm i -save express
- Depois vamos para os principais pacotes de desenvolvimento:
 - npm i -save-dev typescript
 - npm i -save-dev tsx (compilador que compila o arquivo em tempo real apenas em desenvolvimento)
 - npm i -save-dev @types/node @types/express (tipagens para o uso do node)

 #### 2
- Configurando o package.json:
 - Primeira configuração e a do tsx, apenas adicionamos um script rapido que faça ele ficar ouvindo o servidor com o TS, Ex: ¨tsx src/server.ts¨