# Recorrência mensal e diária

## 1. Objetivo

A recorrência evita lançar de novo, todo mês, um aluguel ou um salário, ou todo dia uma diária de funcionário ou uma venda fixa.

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

A frequência é mensal (`MONTHLY`) ou diária (`DAILY`).

A primeira data é a data do lançamento registrado.

**Mensal:** a projeção começa no mês seguinte. O dia do mês é o mesmo da data inicial. Em um mês mais curto, a ocorrência cai no último dia. No mês seguinte, o dia original volta. Não há data final até a série ser encerrada.

**Diária:** a projeção começa no dia seguinte e só entra nos dias da semana escolhidos (`weekdays`, 0 = domingo a 6 = sábado). O formulário oferece segunda a domingo, segunda a sexta, segunda a sábado ou dias avulsos. A data do lançamento pode cair fora desses dias (por exemplo, cadastrar no domingo uma série de segunda a sábado): ele fica registrado na data escolhida e só os dias da semana marcados entram na projeção. A data final é obrigatória na série: se o formulário vier sem ela, vale 31/12 do ano do lançamento (ou do ano seguinte, se o lançamento for em 31/12). Ela precisa ser depois do lançamento e no máximo 12 meses depois dele.

A projeção olha 12 meses à frente da data de referência.

A data final encerra a série.

Se já existe um lançamento ativo com a mesma descrição, o mesmo tipo e o mesmo dia, a projeção daquele dia não entra de novo.

Ocorrências projetadas têm status pendente. Lançamentos cancelados não ocupam o dia.

---

## 6. Cadastro da série

A tela de lançamentos lista as repetições ativas.

Cada item mostra descrição, valor, tipo, conta e quando repete: o dia do mês, ou os dias da semana e a data final.

**Alterar** muda a descrição, o valor, o tipo e a conta. Na mensal, muda o dia do mês. Na diária, muda os dias da semana e a data final. A frequência não muda. A mudança vale para as próximas projeções. O lançamento já registrado não é reescrito.

**Encerrar** desativa a série. As próximas repetições saem do dia do aperto. O lançamento já registrado permanece.

Quem só consulta vê a lista e não altera nem encerra.

---

## 7. Fora desta versão

* repetir a cada semana ou a cada N dias;
* trocar a frequência de uma série já criada;
* gravar cada dia ou mês futuro como lançamento na lista.
