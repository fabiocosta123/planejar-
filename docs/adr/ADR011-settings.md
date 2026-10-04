# ADR011 — Configurações da conta

## Status

Accepted

## Date

2026-10-03

## Context

A navegação Configurações existia sem página. A reserva mínima, a visibilidade do dia do aperto e o nível de aviso já ficam em `UserSettings` e já mudam o painel, mas a pessoa não conseguia editá-los. Também não havia como sair da sessão.

## Decision

A tela edita só a conta logada.

A reserva mínima aceita zero ou mais e segue para o dia do aperto. Mostrar ou ocultar esse cartão é uma preferência. O nível de aviso pode ser nenhum, importantes ou todos. Nenhum impede o registro de avisos para essa pessoa.

O plano aparece só para leitura. A versão grátis continua liberando o Pro pelo PIX já existente. A tela não altera moeda, idioma, tema nem senha.

## Consequences

Cada pessoa guarda a própria reserva sobre o saldo da família. O aviso de um lançamento continua destinado ao usuário principal, respeitando o nível de aviso dele.
