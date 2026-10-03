# ADR006 — Cadastro da série mensal

## Status

Accepted

## Date

2026-10-03

## Context

A série mensal já projeta os próximos meses no dia do aperto. Sem uma tela para vê-la, um valor errado ou uma repetição marcada sem querer continua valendo por doze meses.

O lançamento já registrado é um fato. A série é a regra dos meses seguintes.

## Decision

A tela de lançamentos lista as séries ativas do membro.

Alterar a série atualiza descrição, valor, tipo, dia do mês e conta. O dia fica em `dayOfMonth`, separado da data do primeiro lançamento, para um dia 31 continuar válido mesmo quando a série começou num mês mais curto.

Encerrar a série marca `isActive = false` e define a data final. A projeção deixa de incluí-la.

O lançamento já gravado não é editado nem apagado por essas ações.

Quem tem papel de consulta não altera nem encerra.

## Consequences

Corrigir o aluguel ou parar a repetição passa a valer no dia do aperto sem mexer no histórico.

A lista de lançamentos continua mostrando só o que foi registrado.
