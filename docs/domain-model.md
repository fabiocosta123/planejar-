# Domain Model — Planejamento Financeiro App

## Visão Geral

O Planejamento Financeiro App é um sistema de planejamento financeiro pessoal e familiar.

O objetivo principal é permitir que usuários acompanhem sua situação financeira atual e projetem cenários futuros através de um motor financeiro especializado.

O sistema não é apenas um controle de receitas e despesas. Ele funciona como uma ferramenta de tomada de decisão financeira.

---

# Princípios do Domínio

## Fonte da verdade

As movimentações financeiras cadastradas pelo usuário são a fonte principal dos dados.

A entidade central do domínio financeiro é:

* Transaction

Todas as projeções e análises são derivadas dessas informações.

---

## Motor Financeiro

O Financial Engine é responsável por todos os cálculos financeiros.

Nenhuma interface, componente ou serviço externo poderá realizar cálculos financeiros diretamente.

Responsabilidades:

* Saldo atual
* Saldo futuro
* Fluxo financeiro
* Dia do Aperto
* Guardar por Dia
* Reserva financeira
* Simulações

---

## Inteligência Artificial

A IA será adicionada futuramente.

Ela nunca será responsável por cálculos financeiros.

A IA apenas interpretará informações geradas pelo Financial Engine.

---

# Estrutura Multiusuário

O sistema será preparado para utilização individual e familiar.

No MVP:

* Cada usuário terá uma família criada automaticamente.
* O usuário será o proprietário dessa família.
* A interface funcionará como uma conta individual.

No futuro:

* Usuários poderão compartilhar uma família.
* Mais pessoas poderão participar do mesmo planejamento financeiro.

---

# Entidades Principais

## Family

Representa um ambiente financeiro compartilhado.

Exemplo:

Família Costa Silva

Responsabilidades:

* Agrupar membros.
* Centralizar dados financeiros.

Relacionamentos:

Family possui:

* Muitos membros.
* Muitas contas.
* Muitas categorias.
* Muitas transações.
* Muitas metas.

---

## User

Representa a conta de autenticação do sistema.

Responsabilidades:

* Login.
* Identificação do usuário.

Um usuário pode participar de uma ou mais famílias através de FamilyMember.

---

## FamilyMember

Representa a participação de um usuário dentro de uma família.

Responsabilidades:

* Definir relacionamento entre usuário e família.
* Controlar permissões futuras.

Exemplos de papéis:

* OWNER
* MEMBER
* VIEWER

---

## Account

Representa onde o dinheiro existe.

Exemplos:

* Carteira
* Conta corrente
* Banco digital
* Poupança

---

## Category

Representa a classificação das movimentações financeiras.

Exemplos:

* Alimentação
* Transporte
* Moradia
* Salário

---

## Transaction

Representa um evento financeiro.

Tipos:

* Receita
* Despesa
* Transferência

É a principal entidade financeira do sistema.

---

## Goal

Representa objetivos financeiros.

Exemplos:

* Viagem
* Reserva de emergência
* Compra de imóvel

---

## Settings

Representa preferências do usuário.

Exemplos:

* Tema
* Moeda
* Idioma

---

# Financial Engine

O Financial Engine não possui tabelas próprias.

Ele utiliza os dados financeiros existentes para gerar informações estratégicas.

Principais módulos:

* Current Balance
* Projected Balance
* Financial Timeline
* Crunch Day
* Daily Saving
* Reserved Balance
* Simulation

---

# Financial Snapshot

A entidade FinancialSnapshot será implementada futuramente.

Ela funcionará como uma camada de otimização.

Objetivos:

* Armazenar projeções calculadas.
* Melhorar desempenho.
* Criar histórico de evolução financeira.

A FinancialSnapshot nunca será a fonte da verdade.

Ela poderá ser recriada a qualquer momento através do Financial Engine.

---

# Arquitetura de Dados

Fluxo principal:

User

↓

Family

↓

Financial Data

↓

Financial Engine

↓

Dashboard / Calendar / Reports

---

# Regras Importantes

1. Nenhuma tela acessa o banco diretamente.

2. Todo acesso ao banco passa por:

Interface

↓

Server Action

↓

Repository

↓

Prisma

↓

Database

3. Nenhuma regra financeira fica em componentes.

4. Nenhum cálculo financeiro será realizado pela IA.

5. Valores monetários devem utilizar tipos adequados para dinheiro.

---

# Evolução Futura

Possíveis módulos:

* Cartão de crédito
* Parcelamentos
* Investimentos
* Orçamento mensal
* Notificações
* Assistente financeiro com IA
* Compartilhamento familiar avançado
