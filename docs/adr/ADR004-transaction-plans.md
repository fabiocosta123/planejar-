# ADR004 — Planos na consulta de lançamentos

## Status

Accepted

## Date

2026-10-03

## Context

A tela de lançamentos precisa servir a versão gratuita e a versão Pro sem duplicar a regra na interface.

A pessoa gratuita consulta um histórico curto. A pessoa Pro consulta o histórico inteiro e compara períodos. As duas veem primeiro os lançamentos mais recentes.

O plano fica em `UserSettings.plan`, com os valores `FREE` e `PRO`. O padrão é `FREE`.

## Decision

A janela de consulta e o comparativo são regras de domínio.

A versão gratuita busca lançamentos a partir de três meses antes da data de referência.

A versão Pro não aplica limite de data e recebe o comparativo do mês corrente com o anterior e do ano corrente com o anterior.

A lista apresenta cinco lançamentos e oferece **Mostrar mais** e **Mostrar menos** nos dois planos.

A interface não calcula totais nem diferenças.

A conexão de contas bancárias pertence à versão Pro. A consulta a uma instituição financeira fica fora desta decisão e será uma integração própria.

## Consequences

Quem permanece em `FREE` não vê o comparativo e não recebe lançamentos anteriores à janela de três meses.

Mudar uma conta para `PRO` amplia a mesma tela, sem outra rota.
