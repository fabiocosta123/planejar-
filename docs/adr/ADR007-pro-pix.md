# ADR007 — Pro liberado por PIX

## Status

Accepted

## Date

2026-10-03

## Context

O dia do aperto e o valor para juntar por dia são a previsão da versão Pro. A conta gratuita continua com os lançamentos, as repetições e o histórico curto.

A cobrança usa a API PIX da MyCredit. O QR Code imediato expira em cerca de 10 minutos. A API não cria uma assinatura mensal. O aviso de pagamento não traz assinatura do corpo.

## Decision

Só `plan = PRO` recebe o cálculo do dia do aperto. A conta gratuita vê o convite e o valor do Pro, sem a data nem o valor diário.

O preço fica em `PRO_PLAN_AMOUNT`. Sem essa variável, o valor é R$ 9,90. O pagamento é único e libera o Pro na conta que pagou.

A aplicação gera o `idFaturaPag`, cria o PIX em `POST /api/pix` e só muda o plano para `PRO` quando `GET /api/pix/{idFaturaPag}` responde pago com o mesmo valor. O webhook `pix.pago` faz a mesma liberação. `pix.estornado` devolve a conta para `FREE` se não restar outro PIX pago.

A chave do integrador e o CNPJ ficam fora do código. A URL do webhook inclui um token. Sem o token, a rota responde como se não existisse.

No sandbox, a tela oferece simular o pagamento. Em produção essa ação não existe.

## Consequences

Quem está em `FREE` deixa de ver a previsão no dashboard.

Sem `MYCREDIT_CNPJ` e `MYCREDIT_INTEGRATOR_KEY`, o convite aparece e a geração do PIX responde que a cobrança ainda não está configurada.

O banco não paga um QR Code gerado no sandbox. A confirmação local usa a consulta e, no sandbox, a simulação.
