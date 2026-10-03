# ADR005 — Recorrência mensal

## Status

Accepted

## Date

2026-10-03

## Context

O dia do aperto só enxerga lançamentos que já existem. Aluguel e salário precisariam ser cadastrados de novo a cada mês para a projeção continuar.

A lista de lançamentos é o histórico registrado. Encher essa lista com doze meses futuros misturaria previsão e fato.

## Decision

Uma série mensal fica em `RecurringTransaction`, ligada à conta e ao membro da família.

O lançamento criado com **Repetir todo mês** é a primeira ocorrência e permanece um registro normal.

A regra de domínio projeta as ocorrências seguintes, por até 12 meses, e entrega essas datas apenas ao dia do aperto.

O resumo do mês não soma a projeção.

A tela não calcula o calendário da série.

## Consequences

Um aluguel marcado como mensal passa a influenciar o dia do aperto nos meses seguintes sem novo cadastro.

A lista não mostra essas ocorrências futuras.

Não há, nesta versão, uma ação para encerrar a série.
