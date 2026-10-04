# ADR012 — Recorrência diária

## Status

Accepted

## Date

2026-10-04

## Context

Quem paga funcionário por dia, ou recebe o mesmo valor todo dia, teria de lançar cada dia para o dia do aperto enxergar esses valores. Muitas dessas rotinas só valem em dias úteis (segunda a sexta ou segunda a sábado).

Uma série diária sem fim projetaria centenas de datas e ficaria esquecida.

## Decision

`RecurringTransaction` ganha a frequência `DAILY` e a coluna `weekdays` (0 = domingo a 6 = sábado).

O lançamento criado com **Todo dia** continua sendo a primeira ocorrência registrada, como na série mensal (ADR005). Ele fica na data escolhida mesmo que ela não seja um dos dias marcados, para a pessoa poder cadastrar a série em qualquer dia.

Os campos de data da tela usam DD/MM/AAAA. O servidor continua recebendo AAAA-MM-DD.

A série diária sempre tem `endDate`. Sem data informada, vale 31/12 do ano do lançamento. A data final fica entre o dia seguinte ao lançamento e 12 meses depois dele, o mesmo horizonte da projeção.

A regra de domínio projeta só os dias escolhidos depois do lançamento, até a data final, apenas para o dia do aperto. Um dia que já tem lançamento igual (mesma descrição, tipo e data) não entra de novo.

A edição muda os dias da semana e a data final. A frequência de uma série não muda.

## Consequences

Uma diária de segunda a sexta passa a influenciar o dia do aperto até a data final sem novo cadastro.

A lista de lançamentos continua mostrando só o que foi registrado. Os dias futuros não aparecem nela.

A série termina sozinha na data final. Para continuar, a pessoa altera a data final ou cria outra série.
