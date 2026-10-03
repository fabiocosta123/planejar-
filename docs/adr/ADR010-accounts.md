# ADR010 — Contas do saldo

## Status

Accepted

## Date

2026-10-03

## Context

O painel mostra um saldo só. Os lançamentos já escolhem uma conta, e a família compartilhada grava no saldo do usuário principal.

A navegação Contas existia sem página.

## Decision

A tela lista as contas abertas desse saldo.

Cada saldo até hoje sai da regra já usada no motor: saldo inicial mais lançamentos concluídos até a data. A interface só apresenta o número.

A conta padrão é a que o formulário de lançamento oferece primeiro. A primeira conta vira padrão. Outra pode assumir esse lugar.

Quem só consulta vê a lista e não cria nem troca o padrão.

A conexão com banco continua fora desta tela.

## Consequences

Familiar e principal veem as mesmas contas. Um lançamento novo segue a conta marcada, salvo escolha manual no formulário.
