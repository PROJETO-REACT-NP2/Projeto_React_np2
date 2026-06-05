# 🚀 Changelog e Melhorias - Calculadora Tributária

**Equipe 2026.1:** José Rodrigues Ferreira Filho, Raimundo Alisson de Sousa Ferreira, Esdras Sales Nobre e Mikael Canuto M. B. Albuquerque  
**Disciplina/Professor:** Análise e Desenvolvimento de Sistemas / Maurício Moreira Neto - Unichristus  

Abaixo, detalhamos a lista de atualizações e implementações significativas adicionadas à versão atual do sistema, garantindo um código escalável, limpo e profissional.

## ✨ O que há de novo? (Features Implementadas)
- **Histórico de Cálculos Persistente:** Quando os usuários realizam login e interagem com a Calculadora, seus dados de renda, custos e as diferenças do cálculo PF x PJ agora são **salvos no banco de dados** automaticamente.
- **Nova Página de Histórico (Frontend):** Foi criada a página `/historico` (`HistoricoCalculos.jsx`) onde o usuário logado pode visualizar todas as suas simulações anteriores devidamente organizadas.

## 🛠️ Mudanças Arquiteturais (Refatoração de Código)
### Backend (API)
- **Migração do TypeORM para Prisma ORM:** O motor do banco de dados foi modernizado. Toda a camada de repositórios do antigo *TypeORM* foi substituída pela confiabilidade do `PrismaService`, facilitando as migrações e o gerenciamento do banco PostgreSQL.
- **Arquitetura MVC Fortalecida:** O padrão do ecossistema *NestJS* foi rigorosamente ajustado. Agora há uma forte separação entre:
  - `Controllers` (`auth`, `calculo`, `user`): lidando apenas com requisições e respostas.
  - `Services`: concentrando todas as lógicas de negócio e tributárias sem misturar com a camada da web.
- **Documentação de Código:** Inserção do padrão **JSDoc** detalhando cada método, parâmetros e retornos de todos os Controllers e Services, deixando o código inteiramente autodescritivo.

### Frontend (React + Vite)
- **Integração Fluída com a API:** O arquivo `App.jsx` teve sua inteligência aprimorada. Agora, os cálculos rodam de modo otimizado e enviam os dados pro Backend de forma condicional (somente se o envio de E-mail foi checado ou se o usuário estiver autenticado com token ativo).
- **Tratamento de URL Base Inteligente:** O sistema agora compreende de forma dinâmica se está rodando via `localhost` ou ambientes como `GitHub Codespaces`, trocando os *endpoints* automaticamente.
- **Code Clean-up e Documentação JSDoc:** Códigos antigos e *console.logs* desnecessários foram removidos; e toda a raiz do projeto React ganhou forte documentação técnica nos componentes.

## 🐳 Infraestrutura e Documentação de Implantação
Para facilitar o *Onboarding* de novos desenvolvedores, criamos múltiplos guias robustos focados na execução independente do sistema:
- **`README.md` Raiz:** Apresentação atualizada do projeto, com contexto geral e fluxograma prático de instalação rápida.
- **`DOCKER.md` (Novo):** Manual oficial da aplicação cobrindo do zero a instalação do Docker e o acionamento do `docker-compose up -d` para contêinerização do banco de dados.
- **READMEs Modulares:** Dentro do repositório da `API` e do `React` criamos manuais de setup focados na instalação e inserção de credenciais de ambiente (`.env`).
