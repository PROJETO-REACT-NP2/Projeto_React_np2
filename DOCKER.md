# 🐳 Guia de Utilização do Docker

O Docker permite empacotar a aplicação e suas dependências (como o banco de dados) em contêineres, facilitando a execução e garantindo que o ambiente será o mesmo em qualquer máquina.

Neste projeto, utilizamos o **Docker** primariamente para levantar o banco de dados **PostgreSQL** rapidamente, sem a necessidade de instalá-lo diretamente no sistema operacional. (A API e o Frontend podem ser executados localmente de forma nativa com Node.js e Vite).

---

## 🛠️ Passo a Passo: Como Instalar o Docker

1. **Baixe o Docker Desktop:**
   - Acesse o site oficial: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Clique em "Download" e escolha o instalador compatível com o seu sistema (Windows, macOS ou Linux).

2. **Instalação:**
   - **No Windows:** Execute o arquivo baixado. É recomendado usar o backend WSL 2 (Windows Subsystem for Linux) se solicitado durante a instalação.
   - **No macOS:** Abra o arquivo `.dmg` e arraste o Docker para a pasta Applications.

3. **Iniciando o Docker:**
   - Após a instalação, abra o aplicativo **Docker Desktop**.
   - Aceite os termos. Você verá o ícone do Docker na sua barra de tarefas/menu bar indicando que o *engine* está rodando (pode levar alguns segundos).

---

## 🚀 Como Executar o Banco de Dados com Docker

Na pasta do backend (`Projeto_React_CMJS/calculadora-api`), nós disponibilizamos um arquivo chamado `docker-compose.yml`. Ele possui as instruções de que imagem de banco usar e as credenciais padrão.

1. Abra o seu terminal.
2. Navegue até a pasta da API:
   ```bash
   cd c:\Users\josej\Desktop\ESTUDOS\projetos\trabalho_np1\Projeto_React_np2\Projeto_React_CMJS\calculadora-api
   ```
3. Execute o comando para iniciar o banco em segundo plano:
   ```bash
   docker-compose up -d
   ```
   *Nota: O parâmetro `-d` faz o contêiner rodar em modo "detached" (em segundo plano).*

4. Pronto! Seu banco de dados PostgreSQL estará rodando na porta **5432**.
   - Credenciais padrão (verifique o `docker-compose.yml` e o seu `.env`):
     - **Usuário:** postgres
     - **Senha:** postgres
     - **Banco:** calculadora_db

5. Se você precisar parar o banco de dados, basta executar:
   ```bash
   docker-compose down
   ```

---

## 💡 É obrigatório usar o Docker?

**NÃO! O Docker é totalmente OPCIONAL.**

Se você prefere não instalar o Docker, basta instalar o [PostgreSQL localmente na sua máquina](https://www.postgresql.org/download/) e criar um banco de dados chamado `calculadora_db`.
Depois de criar o banco localmente, basta inserir as suas próprias credenciais no arquivo `.env` dentro da pasta `calculadora-api`.

Exemplo no `.env`:
```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/calculadora_db?schema=public"
```

Em seguida, lembre-se sempre de rodar a sincronização da tabela:
```bash
npx prisma db push
```
