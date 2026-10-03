# Recorrência mensal

## 1. Objetivo

A recorrência evita lançar de novo, todo mês, um aluguel ou um salário.

Ela existe para o dia do aperto enxergar esses valores antes de eles serem registrados outra vez.

---

## 2. Princípio

O lançamento registrado continua sendo a fonte do mês.

A série não cria linhas futuras na lista. O motor projeta as próximas ocorrências só para o cálculo do dia do aperto.

A interface não calcula essas datas.

---

## 3. Arquitetura

```text
Formulário
│
├── Lançamento registrado
└── RecurringTransaction
        │
        ↓
Regra de recorrência
        │
        ↓
Dia do aperto
```

A regra fica em:

```text
src/domain/financial/rules/recurrence.rule.ts
```

A série fica em `recurring_transactions`.

---

## 4. Fluxo de dados

```text
UI
 ↓
Action
 ↓
Service
 ↓
Repositório do lançamento
 ↓
Repositório da série
 ↓
Regra de recorrência
 ↓
Dia do aperto
```

O resumo do mês, o fluxo e o saldo futuro continuam usando apenas os lançamentos do período.

O dia do aperto recebe:

* os lançamentos do mês;
* os lançamentos reais posteriores ao mês, até o horizonte;
* as ocorrências projetadas que ainda não foram registradas.

---

## 5. Regra

A frequência desta versão é mensal.

A primeira data é a data do lançamento registrado. A projeção começa no mês seguinte.

O dia do mês é o mesmo da data inicial. Em um mês mais curto, a ocorrência cai no último dia. No mês seguinte, o dia original volta.

A projeção olha 12 meses à frente da data de referência.

Uma data final, quando existir, encerra a série. O formulário ainda não pede essa data.

Se já existe um lançamento ativo com a mesma descrição, o mesmo tipo e o mesmo dia, a projeção daquele dia não entra de novo.

Ocorrências projetadas têm status pendente. Lançamentos cancelados não ocupam o dia.

---

## 6. Fora desta versão

* encerrar ou editar a série pela tela;
* repetir por semana;
* gravar cada mês futuro como lançamento na lista.
