# ⚛️ Calculadora Tributária - Interface (Frontend React)

Esta é a interface visual da aplicação, desenvolvida com [React](https://reactjs.org/) + [Vite](https://vitejs.dev/). Este subprojeto é uma SPA (Single Page Application) que apresenta formulários ricos, calculadoras dinâmicas e um **Chatbot Inteligente** implementado com a API Gemini do Google.

Os componentes foram construídos de forma modular, com CSS customizado e gerenciamento de estado interno robusto.

## 📋 Pré-requisitos

Para rodar este projeto isoladamente, você precisará de:
- [Node.js](https://nodejs.org/en/) (Versão 18+ recomendada)
- Uma chave válida da API do **Google Gemini** para o Chatbot.

## 🛠️ Configurando o Ambiente (.env)

Dentro da pasta `projeto-react`, existe um arquivo chamado `.env.example`.
Copie-o ou o renomeie para `.env` e defina sua chave do Gemini:

```env
VITE_GEMINI_API_KEY=sua_chave_api_do_gemini_aqui
```
*Se você deixar esse arquivo vazio ou inexistente, a aplicação **não carregará** e apresentará uma tela branca devido à inicialização imediata do cliente da Google.*

## 🚀 Passo a Passo de Execução Isolada

Siga estes passos num terminal aberto dentro da pasta `projeto-react`:

1. **Instale as dependências necessárias:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento (Vite):**
   ```bash
   npm run dev
   ```

A aplicação subirá num endereço local (normalmente `http://localhost:5173/`).

## 📁 Principais Pastas
- `/src/components/` -> Componentes modulares, divididos por responsabilidade (Formulários, Ajuda, Cadastro, Chatbot).
- `/src/App.jsx` -> Onde ocorre a montagem do "Layout" e as rotas utilizando `react-router-dom`. Além de ser o cérebro das chamadas aos cálculos principais e à API do Backend.
- `/src/index.css` -> Onde moram as variáveis do sistema de cores e CSS globais.
