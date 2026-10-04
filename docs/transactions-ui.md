# Lançamentos

## 1. Objetivo

A tela de lançamentos é o lugar em que a pessoa registra e consulta entradas e saídas.

Ela deve permitir:

* registrar um lançamento;
* ver os lançamentos mais recentes;
* buscar por descrição e por mês;
* na versão Pro, comparar mês a mês e ano a ano;
* na versão Pro, consultar o histórico sem limite de tempo.

A interface prioriza leitura rápida no celular.

---

## 2. Princípio Mobile First

A tela segue o mesmo princípio do Dashboard:

> Mobile First: primeiro a tela pequena, depois o espaço maior.

### Prioridades

* campos e botões com área de toque confortável;
* busca visível antes da lista;
* no máximo cinco lançamentos à primeira vista;
* ação clara para ver o restante;
* navegação inferior preservada.

---

## 3. Arquitetura da Interface

```text
Lançamentos
│
├── Header
│   ├── Voltar
│   └── Novo lançamento
│
├── Resumo do mês
│   ├── Entradas
│   └── Saídas
│
├── Comparativo (somente Pro)
│   ├── Mês a mês
│   └── Ano a ano
│
├── Busca
│   ├── Descrição
│   └── Mês
│
├── Lista
│   ├── até 5 lançamentos
│   └── Mostrar mais / Mostrar menos
│
└── BottomNavigation
```

---

## 4. Fluxo de Dados

```text
UI
 ↓
Action
 ↓
Service
 ↓
Regras de domínio
 ↓
Repositório
 ↓
Contract
 ↓
UI
```

A action da consulta é:

```text
src/actions/transactions/get-transaction-history.action.ts
```

O plano da pessoa vem de `UserSettings.plan`.

A janela do histórico é decidida em:

```text
src/domain/financial/rules/transaction-history-window.rule.ts
```

O comparativo é calculado em:

```text
src/domain/financial/rules/history-comparison.rule.ts
```

A interface não soma entradas, saídas nem diferenças. Ela só apresenta os contratos.

---

## 5. Versão gratuita e versão Pro

| Recurso | Grátis | Pro |
| --- | --- | --- |
| Registrar lançamento | Sim | Sim |
| Lista inicial | 5 mais recentes | 5 mais recentes |
| Mostrar mais | Todos os lançamentos carregados | Todos os lançamentos carregados |
| Busca por descrição e mês | Últimos 3 meses | Sem limite de tempo |
| Comparativo mês a mês | Não | Sim |
| Comparativo ano a ano | Não | Sim |
| Histórico de entradas e saídas | 3 meses | Completo |
| Conexão de contas bancárias | Não | Sim, como capacidade da versão |

A conexão com o banco faz parte da oferta Pro. Nesta versão a tela ainda não consulta uma instituição: o histórico Pro é a consulta sem limite de tempo, com o comparativo de períodos.

Lançamentos cancelados não entram no resumo do mês nem no comparativo. Eles continuam visíveis na lista.

---

## 6. Lista

A ordem é da data mais recente para a mais antiga.

Quando há mais de cinco lançamentos no filtro atual, a tela mostra os cinco primeiros e o botão **Mostrar mais**. **Mostrar menos** volta aos cinco.

Trocar a busca ou o mês recolhe a lista de novo.

---

## 7. Busca

A busca filtra a descrição e o mês dentro da janela do plano.

Na versão gratuita, a data inicial é o dia de hoje menos três meses. Um mês anterior a essa data não entra na consulta.

Na versão Pro, a consulta não aplica data inicial.

O texto da tela informa esse limite.

---

## 8. Comparativo

Disponível apenas com `plan = PRO`.

* **Mês a mês:** mês corrente em relação ao mês anterior.
* **Ano a ano:** ano corrente em relação ao ano anterior.

Cada bloco mostra a diferença de entradas e de saídas, e os totais dos dois períodos.

A diferença é o valor atual menos o valor anterior.

---

## 9. Repetir todo mês

O formulário de novo lançamento oferece **Repetir todo mês**.

O lançamento salvo é a primeira ocorrência e entra na lista e no resumo do mês.

As ocorrências seguintes ficam fora da lista. O dia do aperto as recebe como pendentes, por até 12 meses, no mesmo dia do mês.

A regra está em `docs/recurrence.md`.

A mesma tela lista as repetições ativas. Dá para alterar descrição, valor, tipo, dia e conta, e encerrar a série. O lançamento já registrado não muda.
