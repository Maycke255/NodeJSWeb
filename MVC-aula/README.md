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