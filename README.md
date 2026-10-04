# 📊 Planejar+ — Planejamento Financeiro Familiar

> **Planeje hoje para nunca ser surpreendido amanhã.**

O **Planejar+** é um app web (PWA) para organizar o dinheiro da família. Além do saldo de hoje, ele mostra **quando o dinheiro vai apertar** e **quanto guardar por dia** para chegar lá sem ficar no vermelho.

Ele funciona no navegador e pode ser instalado na tela inicial do celular (Android e iOS).

---

## 🚀 Funcionalidades

### Conta e família

* Cadastro e login com e-mail e senha.
* Quem se cadastra primeiro é o **responsável** e cria a família.
* Os familiares entram com o **código de convite** de 6 caracteres e passam a usar o **mesmo saldo** do responsável.
* Papéis: **responsável**, **membro** (lança e edita) e **visualizador** (só consulta).

### Painel

* Saldo até hoje, entradas e saídas do mês.
* Últimos lançamentos.
* **Dia do aperto** e **quanto guardar por dia** (versão Pro).
* Avisos não lidos, com contador no sino.

### Lançamentos

* Entradas e saídas com descrição, valor em R$, data e conta.
* Lançamentos que **se repetem todo mês** (aluguel, água, salário…).
* Séries mensais: editar valor, dia ou conta e parar a repetição sem alterar o que já foi lançado.
* Histórico: **últimos 3 meses** na versão grátis e **sem limite** na Pro.
* Comparação com o mês e o ano anteriores (versão Pro).

### Contas

* Lista das contas da família com tipo (corrente, poupança, carteira, investimento, outra) e saldo até hoje.
* Criar conta com saldo inicial e data.
* Escolher qual conta vem marcada nos novos lançamentos.

### Avisos

* O responsável recebe um aviso quando um familiar registra uma entrada ou saída.
* O que o próprio responsável lança não gera aviso.
* Avisos de movimentação bancária ficam preparados para a versão Pro, para quando houver integração com bancos.

### Configurações

* Reserva mínima (valor que não deve ser usado).
* Mostrar ou esconder o dia do aperto no painel.
* Nível de avisos: nenhum, só importantes ou todos.
* Plano atual e liberação da versão Pro.
* Sair da conta.

### Versão Pro

* Pagamento **único por PIX** de **R$ 9,90** (valor configurável), via MyCredit.
* Libera o dia do aperto, quanto guardar por dia, histórico completo e comparações.

### PWA

* Instalável no **Android** (Chrome → *Instalar app*) e no **iOS** (Safari → *Compartilhar* → *Adicionar à Tela de Início*).
* Abre em tela cheia, com ícone e cores do app.
* Precisa de internet para mostrar os dados. Só os ícones ficam guardados no aparelho.

---

## 🔴 Dia do aperto

É o primeiro dia em que o saldo previsto fica **abaixo da reserva mínima**, considerando os lançamentos futuros e as contas que se repetem todo mês.

| Data      | Evento          | Saldo previsto |
| --------- | --------------- | -------------- |
| Hoje      | Saldo atual     | R$ 100,00      |
| 06/08     | Mercado         | R$ 50,00       |
| **08/08** | **Combustível** | **-R$ 10,00**  |
| 10/08     | Salário         | R$ 1.790,00    |

Resultado: dia do aperto em **08/08**. Faltam **R$ 10,00**, o que dá **R$ 2,00 por dia** guardados até lá.

---

## 🛠️ Tecnologias

* **Next.js 16** (App Router, Server Actions) + **React 19** + **TypeScript**
* **Tailwind CSS 4** + **shadcn/ui** (Radix UI)
* **Auth.js v5** (login por e-mail e senha, senhas com bcrypt)
* **Prisma 7** + **PostgreSQL no Neon** (região São Paulo)
* **MyCredit** para cobrança PIX
* **Vitest** para testes
* Deploy na **Vercel**

---

## 🏗️ Arquitetura

Monólito em camadas. Cada camada só conversa com a de baixo:

```
Tela (app / components)
        ↓
Server Action (actions)        ← sessão do usuário e entrada do formulário
        ↓
Serviço (services)             ← permissões, família e plano
        ↓
Domínio (domain)               ← regras e cálculos financeiros, sem banco
        ↓
Repositório (repositories)     ← acesso ao banco via Prisma
        ↓
PostgreSQL (Neon)
```

Regras do projeto:

* **Todo cálculo financeiro fica no domínio** (motor financeiro). A tela só exibe o resultado.
* **Nenhuma tela acessa o banco diretamente.**
* **Permissões ficam no serviço**: o visualizador não grava, e o membro grava no saldo do responsável.
* Valores em `Decimal(12,2)`, exibidos em R$. Datas em DD/MM/AAAA.
* Exclusão lógica (`deletedAt`) e IDs em UUID.

```
src/
  app/            páginas e rotas (dashboard, transactions, accounts, settings, login, register)
  components/     componentes de tela
  actions/        server actions
  services/       casos de uso
  domain/         regras puras (financeiro, família, avisos, contas)
  contracts/      validação de entrada e formatos de resposta
  repositories/   acesso ao banco
  integrations/   serviços externos (MyCredit)
  lib/            prisma, auth e utilitários
prisma/           schema e migrations
docs/             documentação e decisões (ADR)
```

As decisões de arquitetura estão em [`docs/adr`](docs/adr):

| ADR | Assunto |
| --- | --- |
| [001](docs/adr/ADR001-financial-engine.md) | Motor financeiro |
| [002](docs/adr/ADR002-authentication.md) | Autenticação |
| [003](docs/adr/ADR003-dashboard.md) | Painel |
| [004](docs/adr/ADR004-transaction-plans.md) | Lançamentos por plano |
| [005](docs/adr/ADR005-recurring-transactions.md) | Lançamentos mensais |
| [006](docs/adr/ADR006-series-maintenance.md) | Edição de séries |
| [007](docs/adr/ADR007-pro-pix.md) | Versão Pro por PIX |
| [008](docs/adr/ADR008-family-signup.md) | Cadastro da família |
| [009](docs/adr/ADR009-notifications.md) | Avisos |
| [010](docs/adr/ADR010-accounts.md) | Contas |
| [011](docs/adr/ADR011-settings.md) | Configurações |

---

## ▶️ Como rodar

Pré-requisitos: Node.js 20+ e um banco PostgreSQL (por exemplo, no Neon).

```bash
npm install
```

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://usuario:senha@host/neondb?sslmode=require"
AUTH_SECRET="gere com: npx auth secret"

# Versão Pro (PIX)
MYCREDIT_API_BASE="https://sandboxapi.mycredit.com.br"
MYCREDIT_CNPJ=""
MYCREDIT_INTEGRATOR_KEY=""
MYCREDIT_WEBHOOK_TOKEN=""
PRO_PLAN_AMOUNT="9.90"
```

Crie as tabelas e gere o cliente do Prisma:

```bash
npx prisma migrate deploy
npx prisma generate
```

Opcional: crie um usuário de teste (`teste@planejamento.local` / `Teste@123`) com uma conta:

```bash
npx tsx scripts/create-dev-user.ts
npx tsx scripts/create-dev-account.ts
```

Suba o app em [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

### Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção (inclui checagem de tipos) |
| `npm start` | Roda o build de produção |
| `npm test` | Testes com Vitest |
| `npm run lint` | ESLint |

---

## 💳 PIX em produção

Detalhes em [`docs/pro-checkout.md`](docs/pro-checkout.md). Para cobrar de verdade:

1. Troque `MYCREDIT_API_BASE` para `https://api.mycredit.com.br` e use a chave de produção.
2. Defina `MYCREDIT_WEBHOOK_TOKEN`.
3. Cadastre na MyCredit a URL `https://SEU-DOMINIO/api/webhooks/mycredit/{MYCREDIT_WEBHOOK_TOKEN}`.

---

## 🗺️ Próximos passos

* PIX em produção.
* Transferência entre contas.
* Categorias e metas.
* Integração com bancos (Open Finance) para avisos de movimentação na versão Pro.
* Notificações push e uso offline.
* Assistente com IA para explicar os números do motor financeiro, sem fazer cálculos.

---

## 📄 Licença

Projeto em desenvolvimento. Todos os direitos reservados.
