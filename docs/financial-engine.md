# Financial Engine

## Visão Geral

O Financial Engine é o núcleo do Planejamento Financeiro App.

Todo cálculo relacionado a dinheiro será realizado exclusivamente por este componente.

Seu objetivo é produzir resultados financeiros consistentes, determinísticos e reproduzíveis, independentemente da interface utilizada.

O motor não conhece banco de dados, interface gráfica ou Inteligência Artificial.

Ele apenas recebe informações financeiras, processa essas informações e retorna resultados.

---

# 1. Filosofia

O projeto segue alguns princípios fundamentais.

## Regra 1

O dinheiro nunca é calculado pela Inteligência Artificial.

## Regra 2

O mesmo conjunto de transações sempre produzirá exatamente o mesmo resultado.

## Regra 3

O motor nunca altera dados.

Ele apenas realiza cálculos.

## Regra 4

Toda regra financeira deve existir em apenas um lugar.

## Regra 5

Nenhum componente React poderá calcular valores financeiros.

## Regra 6

Toda informação monetária exibida ao usuário deve ser produzida pelo Financial Engine.

---

# 2. Arquitetura

```
Usuário
        │
        ▼
Server Actions
        │
        ▼
Financial Engine
        │
        ▼
Resultado Financeiro
        │
        ├── Dashboard
        ├── Calendário
        ├── IA
        ├── Relatórios
        └── Notificações
```

---

# 3. Responsabilidades

O Financial Engine é responsável por:

* saldo atual;
* saldo futuro;
* linha do tempo financeira;
* fluxo de caixa;
* calendário financeiro;
* Dia do Aperto;
* reserva diária;
* projeções;
* indicadores financeiros.

Não é responsabilidade do motor:

* salvar dados;
* acessar banco de dados;
* enviar notificações;
* enviar e-mails;
* acessar APIs;
* gerar interface gráfica;
* interpretar linguagem natural;
* executar Inteligência Artificial.

---

# 4. Conceitos

## Saldo Atual

Representa o saldo disponível considerando apenas eventos efetivamente ocorridos até a data atual.

---

## Saldo Futuro

Representa o saldo projetado considerando todos os eventos futuros cadastrados.

---

## Linha do Tempo Financeira

Sequência cronológica de eventos financeiros que demonstra a evolução do saldo ao longo do tempo.

---

## Dia do Aperto

Primeira data em que o saldo projetado fica abaixo da reserva mínima configurada pelo usuário.

Caso isso nunca aconteça, considera-se que não existe Dia do Aperto.

---

## Reserva Diária

Valor mínimo que deve ser economizado diariamente para garantir que todos os compromissos futuros sejam honrados.

---

# 5. Tipos de Transações

Versão inicial:

* Receita
* Despesa

Versões futuras:

* Transferência
* Ajuste
* Estorno
* Investimento
* Rendimento
* Juros
* Impostos

---

# 6. Linha do Tempo Financeira

Todo cálculo será baseado em uma sequência cronológica de eventos.

Exemplo:

```
Saldo Inicial
R$ 500,00

↓

03/08
Salário
+ R$ 2.500,00
Saldo: R$ 3.000,00

↓

05/08
Aluguel
− R$ 1.200,00
Saldo: R$ 1.800,00

↓

08/08
Energia
− R$ 200,00
Saldo: R$ 1.600,00
```

Essa estrutura permitirá gerar dashboards, calendários, gráficos e projeções utilizando uma única fonte de verdade.

---

# 7. Algoritmos

O Financial Engine será composto por algoritmos independentes.

Inicialmente:

* cálculo do saldo atual;
* cálculo do saldo futuro;
* construção da timeline financeira;
* cálculo da reserva diária;
* identificação do Dia do Aperto.

Novos algoritmos poderão ser adicionados sem alterar os existentes.

---

# 8. Regras de Negócio

* Receitas aumentam o saldo.
* Despesas reduzem o saldo.
* Eventos são processados em ordem cronológica.
* Eventos na mesma data respeitam uma ordem de processamento definida pelo motor.
* Nenhum cálculo depende da interface.
* Nenhum cálculo depende do banco de dados.
* Todos os cálculos devem ser determinísticos.

---

# 9. Casos Práticos

## Exemplo

Saldo inicial:

R$ 0,00

Receita:

05/08

* R$ 100,00

Despesa:

06/08

− R$ 50,00

Despesa:

08/08

− R$ 60,00

Resultado:

Saldo Atual:

R$ 100,00

Saldo Futuro:

R$ -10,00

Dia do Aperto:

08/08

Reserva diária:

Calculada automaticamente pelo motor.

---

# 10. Casos Limite

O motor deverá tratar corretamente:

* saldo negativo;
* receitas futuras;
* despesas recorrentes;
* parcelas;
* cancelamentos;
* estornos;
* múltiplas contas;
* múltiplas famílias;
* diferentes moedas (futuro).

---

# 11. Integração com Inteligência Artificial

A IA nunca calculará valores.

Ela utilizará apenas os resultados produzidos pelo Financial Engine para:

* responder perguntas;
* gerar resumos;
* explicar gráficos;
* sugerir economia;
* identificar padrões de consumo;
* sugerir melhorias no planejamento financeiro.

---

# 12. Roadmap

O Financial Engine foi projetado para crescer continuamente.

Entre as funcionalidades previstas estão:

* metas financeiras;
* patrimônio líquido;
* investimentos;
* inflação;
* múltiplas moedas;
* cenários simulados;
* projeções avançadas;
* score financeiro;
* previsão de fluxo de caixa;
* planejamento anual;
* planejamento familiar;
* análises inteligentes assistidas por IA.

---

# Princípio Fundamental

> **Nenhuma regra de negócio financeira poderá existir fora do Financial Engine.**

Este princípio orientará toda a evolução do Planejamento Financeiro App.
