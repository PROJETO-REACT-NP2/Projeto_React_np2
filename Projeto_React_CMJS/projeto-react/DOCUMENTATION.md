# Documentação Completa do Projeto React — Calculadora Tributária

## Visão Geral

Este projeto é uma aplicação React com Vite que fornece uma **Calculadora de Tributação** para comparar dados de Pessoa Física (PF) e Pessoa Jurídica (PJ) voltada para profissionais liberais: Psicólogos, Advogados e Arquitetos.

### Funcionalidades principais:
- Formulário de entrada para renda, custos e profissão
- Cálculo local de imposto para PF (IRPF tabela progressiva) e PJ (Simples Nacional)
- Comparação visual de resultados entre PF e PJ com indicação da melhor opção
- Download de relatório comparativo em PDF
- Chatbot IA integrado (Google Gemini) para dúvidas tributárias
- Sistema de autenticação (Cadastro/Login via JWT)
- Histórico de cálculos persistido no backend
- Formulário de contato (envio via e-mail SMTP)
- Envio opcional de resultados por e-mail
- Página de ajuda com explicações detalhadas

---

## Estrutura de Pastas

```
projeto-react/
  index.html                        # Ponto de entrada HTML com SEO otimizado
  package.json                      # Dependências e scripts
  vite.config.js                    # Configuração do bundler Vite
  .env                              # Variáveis de ambiente (VITE_GEMINI_API_KEY)
  .env.example                      # Exemplo de .env
  README.md                         # Instruções de execução do frontend
  DOCUMENTATION.md                  # Este arquivo
  eslint.config.js                  # Configuração do ESLint
  public/                           # Arquivos estáticos
  src/
    main.jsx                        # Ponto de entrada React (StrictMode + BrowserRouter)
    App.jsx                         # Componente raiz, roteamento e lógica central
    App.css                         # Estilos globais compartilhados
    index.css                       # Reset CSS, fonte Montserrat, gradiente de fundo
    utils/
      apiConfig.js                  # [NOVO] URL centralizada do backend (localhost/Codespaces)
    components/
      CalculadoraForm.jsx           # Formulário principal de entrada de dados
      CalculadoraIR.jsx             # Funções puras de cálculo IRPF e IRPJ
      ResultadoComparacao.jsx       # Cards comparativos PF vs PJ + PDF + vídeo
      GeradorPDF.jsx                # Geração de PDF com @react-pdf/renderer
      CardTributacao.jsx            # Card reutilizável para o PDF
      Row.jsx                       # Linha label/value reutilizável para o PDF
      Header.jsx                    # Navegação principal com indicador de rota ativa
      Footer.jsx                    # Rodapé premium com links e créditos da equipe
      Logo.jsx                      # Logo Unichristus (imagem)
      NotFound.jsx                  # [NOVO] Página 404 estilizada
      HistoricoCalculos.jsx         # Lista de simulações salvas do usuário autenticado
      cadastro/
        CadastroUsuario.jsx         # Formulário de cadastro com validação
        LoginUsuario.jsx            # Formulário de login com JWT
      Chatbot/
        ChatbotUI.jsx               # Painel do chatbot com Google Gemini (IA)
        ChatbotToggle.jsx           # Botão flutuante de abrir/fechar chat
        IconChatbot.jsx             # Componente de imagem do ícone do chatbot
      ContatoForm/
        ContatoForm.jsx             # Formulário de contato com envio para backend
      AjudaPage/
        AjudaPage.jsx               # Página de ajuda com explicações de Renda e Custos
    assets/
      image.png                     # Logo da Unichristus
      IconChatbootIA.png            # Ícone do chatbot Christina
      Imposto_de_Renda__PF_ou_PJ_.mp4  # Vídeo explicativo sobre PF vs PJ
      react.svg                     # Logo React padrão do Vite
      iconChatbotC.png              # Ícone alternativo do chatbot (C)
      iconChatbotN.png              # Ícone alternativo do chatbot (N)
      iconChatbotR.png              # Ícone alternativo do chatbot (R)
      new_bot_logo.png              # Logo alternativo do bot
```

---

## Dependências Principais

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `react` + `react-dom` | ^19.1.1 | Biblioteca principal de UI |
| `react-router-dom` | ^7.9.4 | Roteamento SPA entre páginas |
| `react-hook-form` | ^7.65.0 | Gerenciamento de formulários e validação |
| `axios` | ^1.13.2 | Chamadas HTTP para o backend |
| `@google/genai` | ^1.27.0 | API do Google Gemini (chatbot IA) |
| `@react-pdf/renderer` | ^4.5.1 | Geração de PDF no navegador |
| `react-markdown` + `remark-gfm` | ^10.1.0 / ^4.0.1 | Renderização de Markdown (respostas do chatbot) |
| `vite` | ^7.1.7 | Bundler e servidor de desenvolvimento |

Scripts em `package.json`:
- `npm run dev` — inicia servidor de desenvolvimento Vite
- `npm run build` — gera build de produção
- `npm run preview` — preview local do build
- `npm run lint` — verifica projeto com ESLint

---

## Arquivo Principal: `src/App.jsx`

### Responsabilidades
- Importa e organiza todos os componentes e rotas
- Gerencia o estado global dos cálculos (`dadosFormulario`, `resultadoPF`, `resultadoPJ`)
- Controla a visibilidade do chatbot (`isChatOpen`)
- Define funções de negócio:
  - `handleCalculo()` — executa cálculos PF/PJ, salva no backend se autenticado, envia email se solicitado
  - `handleSendContato()` — envia dados do formulário de contato via API
  - `toggleChat()` — abre/fecha o chatbot flutuante

### Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `CalculadoraForm` + `ResultadoComparacao` | Página principal |
| `/cadastro` | `CadastroUsuario` | Formulário de cadastro |
| `/login` | `LoginUsuario` | Formulário de login |
| `/ajuda` | `AjudaPage` | Perguntas frequentes |
| `/historico` | `HistoricoCalculos` | Histórico de simulações |
| `/contato` | `ContatoForm` | Formulário de contato |
| `*` | `NotFound` | Página 404 (catch-all) |

### Fluxo de dados
1. Usuário preenche `CalculadoraForm` com renda, custos e profissão
2. `CalculadoraForm` chama `onDataSubmit` com payload normalizado
3. `App.jsx` executa `calculadoraIRPF()` e `calculadoraIRPJ()` localmente
4. Resultados são salvos no state e passados para `ResultadoComparacao`
5. Se opção de email estiver ativa, dispara POST para o backend
6. Se o usuário estiver autenticado (token JWT), salva o cálculo no histórico

---

## Módulo Utilitário: `src/utils/apiConfig.js`

Centraliza a configuração da URL base do backend. Detecta automaticamente se a aplicação está rodando em GitHub Codespaces e ajusta a porta.

**Exportações:**
- `getBackendBaseUrl()` — função que detecta o ambiente
- `API_BASE_URL` — constante com a URL base calculada

Utilizado por: `App.jsx`, `CadastroUsuario.jsx`, `LoginUsuario.jsx`, `HistoricoCalculos.jsx`

---

## Componentes de Cálculo

### `src/components/CalculadoraForm.jsx`
Formulário principal com `react-hook-form`:
- **rendaMensal** — obrigatório, até R$ 15.000
- **custosMensais** — obrigatório, não pode ser negativo
- **profissao** — psicólogo, advogado ou arquiteto
- **enviarEmail** + **emailUsuario** — toggle para envio opcional por email
- Spinner animado no botão durante processamento

### `src/components/CalculadoraIR.jsx`
Módulo com funções puras de cálculo:

**`calculadoraIRPF(rendaMensal, custosMensais)`:**
- Base de cálculo = renda − custos
- Faixas progressivas do IRPF com dedução fixa por faixa
- Regra de redução para rendas até R$ 7.350
- Imposto nunca fica negativo

**`calculadoraIRPJ(rendaMensal, profissao)`:**
- Psicólogo/Arquiteto (Anexo III): 6% Simples + 11% INSS sobre pró-labore de 28%
- Advogado (Anexo IV): 4,5% Simples + 11% INSS + 20% INSS Patronal sobre pró-labore fixo
- Fallback de segurança para profissões desconhecidas (usa Anexo III)

---

## Exibição de Resultado

### `src/components/ResultadoComparacao.jsx`
Exibe os resultados PF vs PJ lado a lado com:
- Formatação monetária BRL (`Intl.NumberFormat`)
- Card com borda dourada indicando a melhor opção
- Botão de download do PDF comparativo (via `@react-pdf/renderer`)
- Vídeo explicativo embutido sobre PF vs PJ

### `src/components/GeradorPDF.jsx`
Gera um documento PDF A4 estilizado contendo:
- Cabeçalho com logo e título
- Barra de resumo (profissão, receita, custos)
- Dois cards comparativos usando `CardTributacao` e `Row`
- Rodapé com disclaimer sobre valores simulados

### `src/components/CardTributacao.jsx`
Card reutilizável para o PDF. Recebe `styles`, `titulo`, `melhorOpcao` e `campos`.

### `src/components/Row.jsx`
Linha reutilizável label/value para o PDF. Suporta destaque (`highlight`).

---

## Header, Footer e Navegação

### `src/components/Header.jsx`
Navegação principal com:
- Logo Unichristus + título responsivo (`clamp()`)
- Indicador visual de rota ativa (underline teal)
- Botão hamburger para mobile (CSS responsivo)
- Botão "Sair" quando autenticado (remove token)

### `src/components/Footer.jsx`
Rodapé premium com layout de 3 colunas:
- **Sobre:** descrição da ferramenta
- **Links Rápidos:** Home, FAQ, Contato, Histórico
- **Equipe:** lista de membros do grupo
- Copyright com ano dinâmico

### `src/components/Logo.jsx`
Renderiza a imagem `image.png` (logo Unichristus) com altura fixa.

---

## Páginas Auxiliares

### `src/components/AjudaPage/AjudaPage.jsx`
Página de FAQ com explicações de "Renda Mensal" e "Custos Mensais".
Botão para retornar à calculadora.

### `src/components/ContatoForm/ContatoForm.jsx`
Formulário de contato com `react-hook-form`:
- Campos: nome, email, dúvida
- Validação com mensagens de erro
- Exibe toast de sucesso/erro conforme resposta do backend

### `src/components/NotFound.jsx`
Página 404 estilizada com:
- Número "404" em gradiente
- Card com glassmorphism
- Botão de retorno à Home

---

## Autenticação

### `src/components/cadastro/CadastroUsuario.jsx`
Formulário de cadastro com validação manual:
- Nome (min 3 caracteres), email, idade (18–120), senha (min 6 caracteres)
- POST para `/auth/register` usando `API_BASE_URL`
- Salva token JWT no `localStorage`
- Redireciona para histórico se já autenticado

### `src/components/cadastro/LoginUsuario.jsx`
Formulário de login:
- Email + senha obrigatórios
- POST para `/auth/login` usando `API_BASE_URL`
- Salva token no `localStorage` e redireciona

---

## Histórico de Cálculos

### `src/components/HistoricoCalculos.jsx`
Lista as simulações salvas do usuário autenticado:
- Verifica token no `localStorage`
- GET para `/calculo/historico` com `API_BASE_URL`
- Tela de "Acesso Restrito" se não autenticado
- Cards com renda, custos, imposto PF/PJ, tipo de cálculo e profissão
- Hover animado nos cards

---

## Chatbot IA (Google Gemini)

### `src/components/Chatbot/ChatbotUI.jsx`
Painel completo do chatbot "Christina":
- API do **Google Gemini** (modelo `gemini-2.5-flash`)
- System prompt define personalidade e regras de resposta
- Mantém histórico de conversa via `useRef` (sem re-render)
- Respostas renderizadas com `ReactMarkdown`
- Sugestões iniciais pré-definidas
- Painel expansível/retrátil
- Auto-scroll para mensagens novas

**Configuração:** Requer `VITE_GEMINI_API_KEY` no arquivo `.env`.

### `src/components/Chatbot/ChatbotToggle.jsx`
Botão flutuante no canto inferior direito:
- Tooltip ao hover ("Chris está pronta para te ajudar")
- Ícone circular com imagem do bot

### `src/components/Chatbot/IconChatbot.jsx`
Componente de imagem genérico com props de tamanho e `isRounded`.

---

## Estilos

### `src/index.css`
- Fonte Montserrat (Google Fonts)
- Box-sizing border-box global
- Gradiente azul escuro de fundo fixo
- Layout base de `body` e `#root`

### `src/App.css`
Classes reutilizáveis organizadas por bloco:
- **Formulários:** `.container-principal`, `.calculadora-form`, `.form-input`, `.form-label`
- **Botões:** `.btn-primary` (gradiente + brilho hover), `.btn-secondary` (outline)
- **Feedback:** `.error-message`, `.mensagem-sucesso`
- **Toggle switch:** checkbox estilizado com trilho e bolinha animada
- **Animações:** `fadeInUp`, `fadeInScale`, `pulseBorder` (card vencedor)
- **Responsivo:** Media query `max-width: 768px` para hamburger menu
- **Spinner:** Keyframe `spin` para loading animado nos botões

---

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `VITE_GEMINI_API_KEY` | API Key do Google Gemini para o chatbot | Sim (para chatbot) |

---

## Como Rodar

1. Abra o terminal na pasta `projeto-react`
2. Configure `VITE_GEMINI_API_KEY` no arquivo `.env`
3. Instale dependências: `npm install`
4. Inicie o servidor: `npm run dev`
5. Acesse `http://localhost:5173`

> ⚠️ O backend (NestJS) precisa estar rodando em `localhost:3000` para funcionalidades de autenticação, histórico e envio de email.
