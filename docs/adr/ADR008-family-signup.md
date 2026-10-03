# ADR008 — Cadastro da família

## Status

Accepted

## Date

2026-10-03

## Context

Entrar na aplicação pedia uma conta que só existia se alguém a criasse por fora. A família já tem papéis de proprietário e de membro, e o saldo fica nas contas desse grupo.

O usuário principal abre a família. Um filho, no próprio celular, precisa lançar uma compra nesse mesmo saldo.

## Decision

O cadastro pergunta se a pessoa é o usuário principal.

Quem é o principal cria a família e recebe um código. Quem não é entra com esse código e vira membro.

Os lançamentos, as contas e o saldo que a tela mostra são os do usuário principal. O membro grava no mesmo saldo. Quem só consulta continua sem gravar.

A senha segue em hash. O código da família não é senha.

## Consequences

Cada pessoa entra com o próprio e-mail. O saldo visto no painel é o da família.

O código aparece no painel do usuário principal para ele passar a quem vai lançar.
