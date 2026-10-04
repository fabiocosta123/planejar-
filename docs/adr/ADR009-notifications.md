# ADR009 — Avisos de movimentação

## Status

Accepted

## Date

2026-10-03

## Context

O usuário principal precisa saber quando um familiar grava uma entrada ou uma saída no saldo compartilhado, cada um no próprio celular.

A versão Pro, no futuro, também pode receber movimentação vinda de uma conta bancária. Essa conexão ainda não existe. O Open Finance do Brasil não oferece um conector aberto que entregue extrato real.

## Decision

Um lançamento de entrada ou saída feito por alguém que não é o usuário principal gera um aviso para o dono da família.

O lançamento feito pelo próprio principal não gera aviso para ele.

O aviso aparece no painel, com descrição, valor e data. O principal marca como lido.

Quem definiu o nível de aviso como nenhum não recebe esses registros.

Movimentação bancária usa o mesmo aviso, com o tipo próprio, e só é gravada quando o plano do principal é Pro. O ponto de entrada é `recordBankMovement`. Nenhuma instituição financeira é consultada nesta decisão.

## Consequences

Familiares continuam lançando no saldo do principal. O principal vê o aviso ao abrir o painel.

Uma integração bancária futura chama o mesmo serviço. Na versão grátis essa chamada não grava aviso.
