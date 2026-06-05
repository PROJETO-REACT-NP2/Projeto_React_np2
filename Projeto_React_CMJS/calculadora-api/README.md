# ⚙️ Calculadora Tributária - API (Backend)

Esta é a API da aplicação, construída utilizando o framework [NestJS](https://nestjs.com/) com o **Prisma ORM**. Ela é responsável por processar os cálculos tributários, gerenciar a autenticação dos usuários, enviar e-mails via SMTP (Mailtrap) e persistir o histórico de cálculos no banco de dados **PostgreSQL**.

O projeto utiliza um padrão arquitetural inspirado no MVC (Model-View-Controller) suportado nativamente pelos Módulos, Controllers e Services do NestJS.

## 📋 Pré-requisitos

Antes de executar, você precisa ter em sua máquina:
- [Node.js](https://nodejs.org/en/) (Versão 18+ recomendada)
- Banco de Dados PostgreSQL rodando na porta 5432 (Via instalação local ou utilizando nosso `docker-compose.yml`).

## 🛠️ Configurando o Ambiente (.env)

Dentro desta pasta (`calculadora-api`), existe um arquivo de exemplo chamado `.env.example`.
Faça uma cópia dele e renomeie para `.env`. Preencha as informações:

```env
PORT=3000

# Credenciais do Banco de Dados PostgreSQL (Altere usuário e senha se necessário)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calculadora_db
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/calculadora_db?schema=public"

# Autenticação JWT
JWT_SECRET=sua_chave_secreta_jwt_aqui
JWT_EXPIRES_IN=1h

# Envio de E-mails (Mailtrap ou outro SMTP)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=seu_usuario
MAILTRAP_PASS=sua_senha
```

## 🚀 Passo a Passo de Execução Isolada

Siga estes passos num terminal aberto dentro da pasta `calculadora-api`:

1. **Instale as dependências da aplicação:**
   ```bash
   npm install
   ```

2. **Gere o Cliente do Prisma e sincronize as tabelas com seu banco de dados:**
   *(O Banco de Dados PostgreSQL precisa estar ligado neste momento!)*
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   > **Aviso:** Se der erro de conexão ("Can't reach database server"), verifique se seu PostgreSQL está rodando.

3. **Inicie o Servidor:**
   ```bash
   # Modo de desenvolvimento (recomendado)
   npm run start:dev
   ```

O servidor NestJS subirá na porta `3000`.

## 📁 Estrutura de Diretórios da API (Padrão MVC)
- `/src/auth/` -> Contém a lógica de autenticação (JWT) e proteção de rotas (Guards).
- `/src/calculo/` -> Controllers e Services encarregados da matemática dos tributos e persistência de dados.
- `/src/email/` -> Módulo de integração SMTP.
- `/src/user/` -> Gestão de conta dos usuários.
- `/prisma/schema.prisma` -> Definição de toda a estrutura do banco de dados (A Camada de Modelagem/Repository).
