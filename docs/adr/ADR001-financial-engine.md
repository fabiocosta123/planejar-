# ADR-001 — Financial Engine

## Status

**Accepted**

## Date

2026-08-05

## Context

Aplicações financeiras normalmente espalham regras de cálculo entre o frontend, backend, banco de dados e até integrações externas. Essa abordagem torna o sistema difícil de manter, aumenta a chance de inconsistências e dificulta a realização de testes automatizados.

Além disso, o Planejamento Financeiro App utilizará Inteligência Artificial para auxiliar o usuário com análises e sugestões. Caso a IA seja responsável por cálculos financeiros, diferentes interpretações poderão gerar resultados inconsistentes, comprometendo a confiabilidade do sistema.

Como o objetivo principal do aplicativo é fornecer uma visão precisa da situação financeira atual e futura, torna-se necessário centralizar toda a lógica financeira em um único componente.

---

## Decision

Foi decidido que **todo cálculo financeiro será executado exclusivamente pelo Financial Engine**.

O Financial Engine será um componente independente, determinístico e desacoplado da interface gráfica, do banco de dados e da Inteligência Artificial.

Serão responsabilidades exclusivas do Financial Engine:

* cálculo do saldo atual;
* cálculo do saldo futuro;
* construção da linha do tempo financeira;
* projeção diária do saldo;
* identificação do **Dia do Aperto**;
* cálculo da reserva diária necessária;
* projeções financeiras;
* geração de indicadores para dashboard;
* geração de indicadores para o calendário financeiro;
* geração de dados para relatórios.

O Financial Engine receberá apenas dados de entrada e produzirá resultados, sem realizar operações de persistência.

A Inteligência Artificial consumirá exclusivamente os resultados produzidos pelo Financial Engine.

---

## Consequences

### Benefícios

* Existe apenas um local responsável pelos cálculos financeiros.
* Os resultados permanecem consistentes em toda a aplicação.
* O sistema torna-se altamente testável.
* O motor pode ser reutilizado em qualquer interface (Web, PWA, Desktop ou API).
* O frontend permanece simples.
* O banco de dados torna-se apenas uma camada de persistência.
* A IA não interfere nos cálculos financeiros.

### Desvantagens

* O Financial Engine torna-se um componente crítico do sistema.
* Exigirá ampla cobertura de testes automatizados.
* Toda nova regra financeira deverá ser implementada exclusivamente no motor.

---

## Regras Arquiteturais

As seguintes regras passam a fazer parte da arquitetura oficial do projeto:

1. Nenhum cálculo financeiro poderá existir fora do Financial Engine.
2. Componentes React nunca calcularão valores monetários.
3. Server Actions apenas orquestram chamadas ao Financial Engine.
4. Consultas SQL não conterão regras financeiras.
5. A Inteligência Artificial jamais calculará valores financeiros.
6. Toda informação monetária apresentada ao usuário deverá ser produzida pelo Financial Engine.

---

## Alternatives Considered

Foram consideradas alternativas como:

* cálculos diretamente no frontend;
* cálculos distribuídos entre backend e frontend;
* cálculos realizados pela IA.

Todas foram descartadas por aumentarem a complexidade, dificultarem testes e introduzirem risco de inconsistência.

---

## Future Evolution

No futuro, o Financial Engine poderá evoluir para suportar:

* múltiplas moedas;
* inflação;
* investimentos;
* patrimônio líquido;
* metas financeiras;
* cenários simulados;
* previsão de fluxo de caixa;
* análise patrimonial.

Essas evoluções não alteram a decisão arquitetural registrada neste ADR.
