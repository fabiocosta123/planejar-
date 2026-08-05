# 📊 Planejamento Financeiro App

> **Planeje hoje para nunca ser surpreendido amanhã.**

O **Planejar+** é um sistema web desenvolvido para ajudar pessoas a administrar sua vida financeira de forma inteligente, indo muito além do tradicional controle de receitas e despesas.

O principal objetivo do projeto é permitir que o usuário visualize não apenas o saldo atual, mas também o impacto financeiro de suas decisões futuras, identificando antecipadamente situações de risco e auxiliando no planejamento diário.

---

# 🎯 Objetivo

A maioria dos aplicativos financeiros responde apenas à pergunta:

> **"Quanto dinheiro eu tenho hoje?"**

Este projeto responde perguntas muito mais importantes:

* Quanto dinheiro terei daqui a 7 dias?
* Quando ficarei sem dinheiro?
* Quanto preciso guardar por dia para cumprir meus compromissos?
* Posso realizar determinada compra sem comprometer meu planejamento?
* Qual será o impacto financeiro dessa decisão?

---

# 🚀 Diferenciais

* 📈 Saldo Atual
* 🔮 Saldo Projetado
* 📅 Calendário Financeiro Inteligente
* 🔴 Dia do Aperto
* 💰 Guardar por Dia
* 🏦 Múltiplas Contas
* 🎯 Metas Financeiras
* 📊 Fluxo de Caixa Projetado
* 📱 Mobile First
* 📲 Progressive Web App (PWA)
* 🤖 Assistente Financeiro com IA (fase futura)

---

# 🔴 Dia do Aperto

O **Dia do Aperto** é uma funcionalidade exclusiva do projeto.

Ela identifica automaticamente a primeira data em que o usuário ficará com saldo negativo considerando todas as receitas e despesas futuras cadastradas.

Exemplo:

| Data      | Evento          | Saldo Projetado |
| --------- | --------------- | --------------: |
| Hoje      | Saldo Inicial   |       R$ 100,00 |
| 06/08     | Mercado         |        R$ 50,00 |
| **08/08** | **Combustível** |   **-R$ 10,00** |
| 10/08     | Salário         |     R$ 1.790,00 |

Nesse cenário o sistema informa:

* 📅 Dia do Aperto: **08/08**
* 💰 Valor necessário: **R$ 10,00**
* 📈 Economia diária sugerida: **R$ 2,00 por dia**

---

# 💡 Conceitos Principais

O sistema foi projetado para funcionar como um **Planejador Financeiro Inteligente**, baseado em projeções financeiras e não apenas em registros históricos.

Os principais conceitos são:

* Saldo Atual
* Saldo Projetado
* Fluxo de Caixa Diário
* Reserva Financeira
* Valor Disponível para Gastar
* Dia do Aperto
* Guardar por Dia
* Simulação Financeira (futuro)

---

# 🧠 Motor Financeiro

Toda a inteligência do sistema será centralizada em um componente chamado **Financial Engine**.

Ele será responsável por calcular:

* Saldo Atual
* Saldo Projetado
* Fluxo Financeiro
* Dia do Aperto
* Reserva Financeira
* Valor a Guardar por Dia
* Simulações Financeiras

Nenhuma outra parte da aplicação realizará cálculos financeiros.

---

# 🤖 Inteligência Artificial

A IA será implementada em uma fase posterior do projeto.

Ela **não será responsável por cálculos financeiros**.

Seu papel será interpretar os resultados produzidos pelo **Financial Engine**, permitindo ao usuário interagir utilizando linguagem natural.

Exemplos:

* "Posso comprar uma televisão?"
* "Quanto posso gastar este final de semana?"
* "Quando ficarei negativo?"
* "Como posso evitar o Dia do Aperto?"

Toda resposta será baseada nos cálculos realizados pelo Motor Financeiro.

---

# 🏗️ Arquitetura

A aplicação será organizada por domínio, permitindo evolução contínua do projeto.

```
app/

components/

features/
    dashboard/
    transactions/
    categories/
    calendar/
    goals/
    accounts/

actions/

repositories/

services/

lib/
    financial-engine/

prisma/

types/

utils/
```

---

# 🛠️ Stack

## Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui
* Radix UI

## Backend

* Next.js Server Actions
* Prisma ORM

## Banco de Dados

* Neon PostgreSQL

## Futuro

* OpenAI API
* Push Notifications
* Offline Sync
* Widgets Mobile

---

# 📱 Mobile First

O sistema será desenvolvido priorizando dispositivos móveis.

Toda a experiência será pensada inicialmente para smartphones, sendo posteriormente adaptada para tablets e desktops.

---

# 📲 Progressive Web App

O projeto será disponibilizado como **PWA**, permitindo:

* Instalação na tela inicial
* Experiência semelhante a aplicativo nativo
* Atualizações automáticas
* Funcionamento offline (quando suportado)
* Sincronização de dados
* Notificações (fase futura)

---

# 📋 Princípios do Projeto

Durante todo o desenvolvimento serão seguidos os seguintes princípios:

* Mobile First
* Progressive Web App
* Clean Architecture
* SOLID
* Domain-Driven Design (DDD)
* Componentização
* Tipagem forte com TypeScript
* Prisma como fonte de verdade do banco de dados
* UUID como identificador padrão
* Soft Delete
* Auditoria de entidades

---

# 📏 Regras de Arquitetura

Estas regras são obrigatórias durante todo o desenvolvimento.

### O Motor Financeiro é a única fonte de verdade.

Todo cálculo financeiro deverá ser realizado exclusivamente pelo **Financial Engine**.

### A IA nunca realizará cálculos financeiros.

A Inteligência Artificial apenas interpretará os dados produzidos pelo Motor Financeiro.

### Nenhuma tela acessará o banco diretamente.

Fluxo obrigatório:

```
Interface

↓

Server Action

↓

Repository

↓

Prisma

↓

Neon PostgreSQL
```

### O domínio será a base da aplicação.

Toda nova funcionalidade deverá respeitar o modelo de domínio previamente definido.

---

# 🚀 Roadmap

## Fase 1

* Estrutura do projeto
* Banco de dados
* Autenticação
* Dashboard
* Receitas
* Despesas
* Categorias
* Contas
* Calendário Financeiro

## Fase 2

* Motor Financeiro
* Dia do Aperto
* Guardar por Dia
* Reserva Financeira
* Simulações

## Fase 3

* Metas
* Relatórios
* Cartões de Crédito
* Orçamentos
* Investimentos

## Fase 4

* Inteligência Artificial
* Recomendações Inteligentes
* Assistente Financeiro
* Planejamento Automático

---

# Desenho de Dominio
                     User
                       │
      ┌────────────────┼────────────────┐
      │                │                │
      ▼                ▼                ▼
   Account         Category         Settings
      │                │
      │                │
      └──────────┐     │
                 ▼     ▼
             Transaction
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
RecurringTransaction      Attachment

                 │
                 ▼
          Financial Engine
      ┌─────────┼────────────┬──────────────┬─────────────┐
      ▼         ▼            ▼              ▼             ▼
 Current    Projected    Crunch Day    Daily Saving   Timeline

                 │
                 ▼
              Calendar

                 │
                 ▼
               Reports

                 │
                 ▼
                 Goal

---
# Arquitetura Geral do projeto


                              Planejamento Financeiro
                                       │
    ┌──────────────────────────────────┼──────────────────────────────────┐
    │                                  │                                  │
Authentication                     Financial Core                     User Experience
    │                                  │                                  │
    ▼                                  ▼                                  ▼
User                           Financial Engine                    Dashboard
Session                        Ledger                              Calendar
Auth                           Planning                            Reports
                               Simulation                          PWA
                               Goals                              Notifications

---
# ERD (Modelo Conceitual)

User
──────────────────────────────
id (UUID)
name
email
passwordHash
image
createdAt
updatedAt
deletedAt


Relacionamentos
1 User

↓

N Accounts

N Categories

N Transactions

N Goals

1 Settings



Account
──────────────────────────────
id
userId
name
type
initialBalance
color
icon
isDefault
isActive
createdAt
updatedAt
deletedAt


Category
──────────────────────────────
id
userId
name
icon
color
type
isDefault
isActive
createdAt
updatedAt
deletedAt


Transaction
──────────────────────────────
id
userId
accountId
categoryId

description

amount

transactionType

status

transactionDate

competencyDate

isRecurring

notes

createdAt

updatedAt

deletedAt




Relacionamentos

User

↓

Transaction

↓

Category

↓

Account

Goal
──────────────────────────────
id

userId

title

description

targetAmount

currentAmount

targetDate

status

createdAt

updatedAt


Settings
──────────────────────────────
id

userId

theme

language

currency

firstDayOfMonth

createdAt

updatedAt


RecurringTransaction
──────────────────────────────
id

transactionId

frequency

interval

startDate

endDate

nextExecution


Attachment
──────────────────────────────
id

transactionId

fileName

mimeType

size

url

createdAt



# Model Schema
Enums

↓

User

↓

Settings

↓

Account

↓

Category

↓

Goal

↓

Transaction

↓

RecurringTransaction

↓

Attachment

---

# 📄 Licença

Projeto em desenvolvimento.

Todos os direitos reservados.
