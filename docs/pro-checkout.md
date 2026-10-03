# Pro por PIX

## 1. Quem vê o dia do aperto

O cálculo fica no serviço do dashboard e só roda quando `UserSettings.plan` é `PRO`.

A interface da conta gratuita mostra o convite. Ela não recebe a data nem o valor para juntar por dia.

## 2. Cobrança

O pagamento é único. O valor vem de `PRO_PLAN_AMOUNT`. O padrão é 9.90.

Variáveis:

* `MYCREDIT_API_BASE` — sandbox `https://sandboxapi.mycredit.com.br` ou produção `https://api.mycredit.com.br`
* `MYCREDIT_CNPJ` — CNPJ da empresa que emite o PIX, só números
* `MYCREDIT_INTEGRATOR_KEY` — chave do integrador daquele ambiente
* `MYCREDIT_WEBHOOK_TOKEN` — segredo da URL de callback
* `PRO_PLAN_AMOUNT` — valor em reais

A autenticação segue a MyCredit: `CNPJ|CHAVE` em Base64, trocado por um JWT em `GET /api/token/{segredo}`.

## 3. Confirmação

A tela consulta o PIX a cada poucos segundos. O plano muda para `PRO` quando a consulta responde pago e o valor confere com a cobrança guardada.

A URL de callback da revenda é:

`/api/webhooks/mycredit/{MYCREDIT_WEBHOOK_TOKEN}`

`pix.pago` libera o Pro. `pix.estornado` tira o Pro se essa conta não tiver outro PIX pago. Um evento repetido não libera de novo.

No sandbox, o botão **Simular pagamento** chama `POST /api/pix/simular-pagamento/{idFaturaPag}` e em seguida a mesma confirmação.
