# Arquitetura MVC

Este projeto segue o padrão **Model-View-Controller (MVC)** para manter o código organizado, escalável e fácil de manter.

## O que é MVC?

MVC é um padrão de arquitetura que divide a aplicação em três componentes principais:

### Model (Modelo)
- **Responsável por:** Gerenciar os dados e a lógica de negócios
- **Localização:** `/backend/models`
- **Exemplos:** Validações, operações com banco de dados, cálculos
- **Não possui:** HTML, CSS, ou lógica de interface

### View (Visão)
- **Responsável por:** Exibir os dados ao usuário
- **Localização:** `/frontend/pages` e `/frontend/components`
- **Exemplos:** HTML, CSS, templates, componentes visuais
- **Não possui:** Lógica de negócio ou acesso direto ao banco de dados

### Controller (Controlador)
- **Responsável por:** Intermediar entre Model e View
- **Localização:** `/backend/controllers`
- **Exemplos:** Processar requisições, validar entrada, coordenar operações
- **Fluxo:** Recebe requisição → Acessa Model → Passa dados para View

## Fluxo de Dados

1. **Usuário interage** com a View (clica em um botão, preenche um formulário)
2. **View envia requisição** ao Controller
3. **Controller processa** e solicita dados ao Model
4. **Model acessa o banco** de dados e retorna dados
5. **Controller formata** os dados e passa para a View
6. **View exibe** os dados formatados ao usuário

## Benefícios

- ✅ **Separação de responsabilidades:** Cada camada tem um propósito único
- ✅ **Fácil de testar:** Você testa cada camada independentemente
- ✅ **Escalável:** Adicionar novas funcionalidades é simples
- ✅ **Manutenível:** Mudanças em uma camada não afetam as outras

## Estrutura de pastas recomendada:
projeto-newsletter/
│
├── backend/                    # Tudo relacionado ao servidor Node.js
│   ├── server.js              # Arquivo principal (entry point)
│   ├── config/                # Configurações (banco de dados, variáveis de ambiente)
│   │   └── database.js
│   ├── controllers/           # Controllers (intermediários)
│   │   ├── newsletterController.js
│   │   └── userController.js
│   ├── models/                # Models (lógica de dados)
│   │   ├── Newsletter.js
│   │   └── User.js
│   ├── routes/                # Rotas da API
│   │   ├── newsletter.routes.js
│   │   └── user.routes.js
│   ├── middlewares/           # Middlewares (autenticação, validação)
│   │   └── authMiddleware.js
│   └── utils/                 # Funções utilitárias
│       └── validators.js
│
├── frontend/                   # Tudo relacionado ao cliente
│   ├── pages/                 # Páginas (cada página é um diretório)
│   │   ├── home/
│   │   │   ├── index.html
│   │   │   ├── home.css
│   │   │   └── home.js
│   │   ├── newsletter/
│   │   │   ├── index.html
│   │   │   ├── newsletter.css
│   │   │   └── newsletter.js
│   │   └── success/
│   │       ├── index.html
│   │       ├── success.css
│   │       └── success.js
│   │
│   ├── components/            # Componentes reutilizáveis
│   │   ├── header/
│   │   │   ├── header.html
│   │   │   ├── header.css
│   │   │   └── header.js
│   │   ├── footer/
│   │   │   ├── footer.html
│   │   │   ├── footer.css
│   │   │   └── footer.js
│   │   └── modal/
│   │       ├── modal.html
│   │       ├── modal.css
│   │       └── modal.js
│   │
│   ├── assets/                # Recursos estáticos
│   │   ├── images/
│   │   │   ├── icons/
│   │   │   ├── logos/
│   │   │   └── illustrations/
│   │   ├── fonts/
│   │   └── videos/
│   │
│   ├── css/                   # CSS global
│   │   ├── global.css         # Estilos globais
│   │   ├── variables.css      # Variáveis CSS (cores, espaçamentos)
│   │   ├── reset.css          # Reset/Normalize
│   │   └── responsive.css     # Media queries globais
│   │
│   ├── js/                    # JavaScript compartilhado
│   │   ├── api.js             # Funções para fazer fetch/requisições
│   │   ├── utils.js           # Funções utilitárias
│   │   ├── constants.js       # Constantes da aplicação
│   │   └── main.js            # Script principal
│   │
│   └── index.html             # HTML principal (carrega componentes)
│
├── public/                    # Pasta servida estaticamente pelo Express
│   ├── css/
│   ├── js/
│   ├── images/
│   └── assets/
│
├── .env                       # Variáveis de ambiente (NÃO commitar no Git!)
├── .gitignore                 # Arquivos a ignorar no Git
├── package.json               # Dependências do projeto
├── README.md                  # Documentação do projeto
└── .editorconfig              # Configuração do editor de código