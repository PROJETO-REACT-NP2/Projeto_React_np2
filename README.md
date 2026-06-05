# 📊 Calculadora Tributária (Frontend + Backend)

📍 **Fortaleza - Ceará | 2026.1**  
🎓 **Centro Universitário Christus - Unichristus**  
📚 **Curso:** Análise e Desenvolvimento de Sistemas  
👨‍🏫 **Professor:** Maurício Moreira Neto  

---

## 👥 Equipe 2026.1

* José Rodrigues Ferreira Filho
* Raimundo Alisson de Sousa Ferreira
* Esdras Sales Nobre
* Mikael Canuto M. B. Albuquerque

---

## 📑 Sumário

1. [Contextualização](#1️⃣-contextualização)
2. [Arquitetura do Projeto (MVC & Modular)](#2️⃣-arquitetura-do-projeto)
3. [Guia de Execução (Como Rodar)](#3️⃣-guia-de-execução)
4. [Lista de Funcionalidades](#4️⃣-lista-de-funcionalidades)
5. [Docker e Infraestrutura](#5️⃣-docker-e-infraestrutura)

---

## 1️⃣ Contextualização

O projeto tem como objetivo o desenvolvimento de uma aplicação web *Full-Stack* (Frontend React + Backend NestJS) para:
* 🧠 Psicólogos
* ⚖️ Advogados
* 🏗️ Arquitetos

A aplicação compara a tributação entre:
* 👤 **Pessoa Física (PF)**
* 🏢 **Pessoa Jurídica (PJ)**

Baseado em:
* 💰 Renda mensal
* 📉 Custos

---

## 2️⃣ Arquitetura do Projeto

O projeto foi dividido em dois subprojetos, adotando princípios de **Separação de Preocupações (SoC)** e padrões arquiteturais modernos.

### 🌐 Backend (NestJS + Prisma) - Padrão MVC Moderno
O servidor, localizado em `Projeto_React_CMJS/calculadora-api`, utiliza o **NestJS** que naturalmente impõe uma arquitetura modular inspirada em **MVC (Model-View-Controller)**:
- **Controllers:** (Ex: `calculo.controller.ts`, `auth.controller.ts`) Gerenciam as rotas HTTP e atuam como a ponte entre o cliente (View) e as lógicas de negócio.
- **Services:** (Ex: `calculo.service.ts`, `auth.service.ts`) Guardam toda a regra de negócio, validação e chamadas lógicas pesadas.
- **Models/Repositories:** Utilizamos o **Prisma ORM** (`prisma.service.ts`) para atuar como a camada de modelagem de dados e acesso ao banco (PostgreSQL).

### ⚛️ Frontend (React + Vite)
Localizado em `Projeto_React_CMJS/projeto-react`, o frontend é uma Single Page Application construída com React, estruturada por componentes (Views). Responsável por gerenciar os estados, renderizar as calculadoras e exibir o histórico tributário.

---

## 3️⃣ Guia de Execução

Para executar esse projeto completo na sua máquina, você precisa ligar o Banco de Dados, o Backend e o Frontend.

### Resumo dos Passos:

#### Passo 1: Subir o Banco de Dados (PostgreSQL)
Você pode usar o **Docker** ou rodar localmente.
Se quiser usar o **Docker** (Recomendado):
1. Leia as instruções completas no arquivo [DOCKER.md](./DOCKER.md).
2. Na pasta do backend (`calculadora-api`), rode o comando: `docker-compose up -d`.

#### Passo 2: Executar a API (Backend)
Leia o [README do Backend](./Projeto_React_CMJS/calculadora-api/README.md) para ver os detalhes, mas resumidamente:
1. Abra o terminal na pasta `Projeto_React_CMJS/calculadora-api`.
2. Configure as variáveis no arquivo `.env` (credenciais do banco, JWT e SMTP).
3. Instale as dependências: `npm install`
4. Crie as tabelas no banco: `npx prisma db push`
5. Inicie a API: `npm run start:dev`

#### Passo 3: Executar o React (Frontend)
Leia o [README do Frontend](./Projeto_React_CMJS/projeto-react/README.md) para detalhes, mas resumidamente:
1. Abra um segundo terminal na pasta `Projeto_React_CMJS/projeto-react`.
2. Configure a API Key do Gemini no arquivo `.env`.
3. Instale as dependências: `npm install`
4. Inicie o Vite: `npm run dev`

---

## 4️⃣ Lista de Funcionalidades

✔️ Cálculo tributário simultâneo (PF vs PJ).  
✔️ Formulários responsivos e com validação inteligente (React Hook Form).  
✔️ **Chatbot Integrado:** Alimentado por IA para sanar dúvidas tributárias.  
✔️ **Histórico Salvo:** Funcionalidade de conta de usuário (Cadastro/Login JWT) onde os cálculos são persistidos e listados.  
✔️ Envio de resultados detalhados por E-mail.  

---

## 5️⃣ Docker e Infraestrutura

A aplicação suporta a execução de sua base de dados em contêineres Docker. 
Para um guia passo a passo de como instalar o Docker na sua máquina, usar os arquivos `compose` ou se quiser configurar o banco *sem o Docker*, verifique o arquivo exclusivo: **[DOCKER.md](./DOCKER.md)** na raiz deste repositório.
