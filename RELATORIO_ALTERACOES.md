# 📄 Relatório de Atualizações e Melhorias do Sistema

Este documento apresenta todas as alterações arquiteturais, correções de bugs e melhorias de UX/UI aplicadas ao projeto **Calculadora de Tributação (React + NestJS)**. 
Ele foi feito sob medida para que a equipe possa estudar as modificações e apresentá-las com clareza.

---

## 🎯 1. Resumo do que foi entregue

As principais dificuldades do projeto envolviam o fluxo de **autenticação** (o usuário parecia estar logado mas o sistema o expulsava), **erros de comunicação com o banco de dados**, **cálculos matemáticos estáticos** e **experiência do usuário (UX)** nas transições de telas. 

Todas essas pendências foram corrigidas. A aplicação agora funciona em um fluxo contínuo, seguro e com as regras de negócio de tributação corretas.

---

## 🛠️ 2. Alterações Realizadas (Backend - NestJS)

### 2.1 Conexão com o Banco de Dados e Cache
- **Ajuste do Schema (`.env`)**: A string de conexão do Prisma foi atualizada para focar no schema correto no servidor PostgreSQL (`192.168.1.244`), schema `bd_rsc_poo`. Isso garante que as tabelas de `Calculo` e `User` fiquem isoladas onde deveriam estar.
- **Limpeza de Módulos Corrompidos**: Ocorria um erro de injeção e falha do pacote `rxjs`. Para resolver definitivamente, a pasta `node_modules` inteira foi excluída e reinstalada do zero de forma limpa, garantindo a estabilidade da subida do servidor.

### 2.2 Correção da Lógica de Cálculo (Regras de Negócio Reais)
**Arquivo modificado:** `calculo.service.ts` e `calculo.controller.ts`
- **O Problema:** A aplicação anterior realizava o cálculo para Pessoa Jurídica usando uma alíquota "engessada" de 6% (Anexo III do Simples Nacional), independente se a pessoa escolhia Psicólogo, Advogado ou Arquiteto.
- **A Solução:** Injetamos o recebimento da variável `profissao`. 
  - **Advogado(a)**: A lógica foi mapeada para **4.5%** de alíquota base (referente ao Anexo IV).
  - **Psicólogo(a) e Arquiteto(a)**: Mantidos em **6%** (Anexo III com benefício do Fator R).
- **O que falar na apresentação:** *"Nós refatoramos o backend para não ser apenas um mock. Agora ele toma decisões tributárias reais baseadas na profissão escolhida na interface, aplicando diferentes alíquotas do Simples Nacional."*

---

## 💻 3. Alterações Realizadas (Frontend - React)

### 3.1 Resolução do "Falso Login" e Token JWT
**Arquivos modificados:** `LoginUsuario.jsx` e `CadastroUsuario.jsx`
- **O Problema:** Ao fazer login, o backend gerava o objeto `{ accessToken: "hash..." }`. O Front-end tentava salvar chamando a chave `result.token`. Como essa chave não existia, o navegador salvava a string `"undefined"`. 
Ao entrar no Histórico, o front enviava o "undefined" para o servidor, recebia um erro `401 Não Autorizado` e derrubava a sessão.
- **A Solução:** Corrigimos o salvamento do `localStorage` chamando corretamente `result.accessToken`.
- **Melhoria extra:** Agora, assim que um usuário finaliza a criação da conta no **Cadastro**, o sistema já loga a pessoa automaticamente, removendo a fricção de pedir para ela digitar a senha novamente.

### 3.2 O Cabeçalho (Header) Inteligente
**Arquivo modificado:** `Header.jsx`
- **O Problema:** O botão "Login" ficava estático no topo da página, mesmo com a pessoa já logada.
- **A Solução:** Adicionamos o hook `useLocation` do React Router DOM para forçar o recarregamento do cabeçalho nas mudanças de rotas. Foi feita a lógica condicional: Se o token for encontrado, renderizamos um botão de **Sair**, indicando com clareza o estado de acesso.

### 3.3 Tratamento do Histórico (UX UI Empty State)
**Arquivo modificado:** `HistoricoCalculos.jsx`
- **O Problema:** Quando não havia token, ou o token expirava, a tela simplesmente redirecionava forçadamente a pessoa para o Login, o que causa estranheza e frustração.
- **A Solução:** Se o usuário tentar clicar no Histórico deslogado, ele visualiza um componente de UI limpo e moderno de **Acesso Restrito** (A famosa *Empty State* ou *Forbidden State* em design). Uma mensagem pede gentilmente para ele entrar com a conta acompanhada de um botão de login.
- **Visualização da Profissão:** Modificamos a listagem de *Cards* do histórico. Agora, caso o banco envie a "profissão" do cálculo, ela é renderizada em uma *tag* ou *badge* visual vermelha, para que a pessoa identifique por que a taxa PJ cobrada deu valores diferentes.

---

## 📚 4. Como Estudar as Mudanças

1. **Abra o arquivo `LoginUsuario.jsx`:** Estude as linhas do `localStorage`. Note que no `useEffect`, inserimos o `navigate('/historico')` para evitar que usuários logados caiam na tela de login de novo.
2. **Abra o arquivo `calculo.service.ts`:** Dê atenção ao método `calculadoraIRPJ`. É ali que a regra de negócio tributária foi construída com `if...else`. Compreenda como os `0.045` (4.5%) e `0.06` (6%) estão aplicados, será uma excelente resposta caso o avaliador pergunte "Mas a plataforma muda a taxa?".
3. **Abra o arquivo `HistoricoCalculos.jsx`:** Olhe o estado `isAuthorized`. Perceba que a ausência de token não chama mais o `navigate` de cara, mas muda o HTML retornado no fim do arquivo para a tela bonita de "Acesso Restrito".

## 🎤 5. Dicas para a Apresentação

- **Comece Mostrando as Barreiras:** Acesse o histórico sem estar logado. Mostre a tela de "Acesso Restrito". Isso valoriza muito a UI/UX do projeto e demonstra o conhecimento da equipe sobre Tratamento de Exceções.
- **Mostre o Fluxo Focado:** Crie uma conta. Mostre que ele não pede pra logar de novo. Faça um cálculo para **Advogado(a)**. Salve.
- **Demonstre a Dinamicidade:** Vá no Histórico e mostre a alíquota em ação, além do *Badge* da Profissão. Explique oralmente que, por debaixo dos panos (Back-End NestJS), o código validou que Advogado era Anexo IV e aplicou a alíquota respectiva.
- **Conclua com o Cabeçalho:** Chame a atenção da banca avaliadora para o menu lá no topo. Mostre o botão "Sair". Isso prova integração plena de "Sessões e Tokens JWT".

> **Nota da Equipe de Desenvolvimento:** O código está em excelente estado arquitetural, dividindo bem as responsabilidades. Boa apresentação!
