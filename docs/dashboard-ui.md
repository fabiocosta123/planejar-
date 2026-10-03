# Dashboard UI

## 1. Objetivo

O Dashboard é a principal tela financeira do aplicativo.

Sua responsabilidade é apresentar, de forma simples e objetiva, a situação financeira atual e projetada do usuário.

O Dashboard deverá apresentar:

* saldo atual;
* receitas do período;
* despesas do período;
* resultado financeiro do período;
* indicação de limite de gastos excedido;
* saldo futuro;
* receitas futuras;
* despesas futuras;
* fluxo financeiro ao longo do período.

A interface deve priorizar leitura rápida e interação simples, principalmente em dispositivos móveis.

---

## 2. Princípio Mobile First

O aplicativo é desenvolvido como uma PWA e deve possuir experiência semelhante à de um aplicativo mobile.

A implementação do Dashboard seguirá o princípio:

> Mobile First: primeiro projetar e implementar para telas pequenas e depois adaptar para telas maiores.

### Prioridades

* elementos grandes o suficiente para toque;
* informações financeiras principais visíveis imediatamente;
* navegação simples;
* baixo número de ações por tela;
* cards compactos;
* hierarquia visual clara;
* rolagem vertical natural;
* adaptação para tablet e desktop.

O layout desktop não deve alterar a estrutura conceitual do Dashboard, apenas reorganizar os elementos para aproveitar melhor o espaço disponível.

---

## 3. Arquitetura da Interface

A estrutura conceitual inicial do Dashboard será:

```text
Dashboard
│
├── Header
│   ├── Saudação
│   ├── Nome do usuário
│   └── Ações
│
├── CurrentBalanceCard
│
├── FinancialSummary
│   ├── Income
│   ├── Expenses
│   └── Balance
│
├── FutureBalanceCard
│
├── FinancialFlow
│
└── BottomNavigation
```

A estrutura poderá evoluir durante a implementação, mas qualquer alteração deverá preservar a clareza das responsabilidades.

---

## 4. Fluxo de Dados

O Dashboard seguirá a arquitetura existente do projeto:

```text
UI
 ↓
Action
 ↓
Service
 ↓
Financial Engine
 ↓
Domain Model
 ↓
Mapper
 ↓
Contract
 ↓
UI
```

A Action responsável pelo Dashboard é:

```text
src/actions/financial/get-financial-dashboard.action.ts
```

Ela resolve o contexto necessário, obtém o saldo atual e solicita ao serviço o cálculo completo do Dashboard.

---

## 5. Regra Fundamental

A interface **não realiza cálculos financeiros**.

Componentes React não devem calcular:

* saldo;
* receitas;
* despesas;
* saldo futuro;
* projeções;
* fluxo financeiro;
* limite de gastos;
* estados financeiros derivados.

A UI deve receber os valores já calculados através dos Contracts.

A regra arquitetural permanece:

> **Financial Engine calcula. Services orquestram. Actions expõem. Contracts transportam. UI apresenta.**

Essa separação é obrigatória para evitar duplicação das regras financeiras no frontend.

---

## 6. Dashboard Contract

O Dashboard utiliza o seguinte contrato:

```text
DashboardContract
│
├── FinancialSummaryContract
│
├── FutureBalanceContract
│
└── FinancialFlowContract[]
```

### FinancialSummaryContract

Responsável pelo resumo financeiro do período.

```text
income
expenses
balance
limitExceeded
```

### FutureBalanceContract

Responsável pela projeção financeira.

```text
currentBalance
futureIncome
futureExpenses
futureBalance
isPositive
isNegative
```

### FinancialFlowContract

Representa cada ponto do fluxo financeiro.

```text
date
income
expenses
balance
isPositive
isNegative
```

---

## 7. Componentes Visuais

Os componentes serão construídos com foco em responsabilidade única.

### DashboardPage

Responsável pela composição geral da tela.

Não deve conter regras de cálculo financeiro.

---

### CurrentBalanceCard

Apresenta:

* saldo atual;
* estado positivo/negativo;
* contexto visual do saldo.

Responsabilidade:

> somente apresentação.

---

### FinancialSummary

Apresenta:

* receitas;
* despesas;
* resultado do período;
* indicação de limite excedido.

Responsabilidade:

> somente apresentação dos dados recebidos.

---

### FutureBalanceCard

Apresenta:

* saldo atual;
* receitas futuras;
* despesas futuras;
* saldo futuro;
* indicação visual de saldo positivo ou negativo.

Responsabilidade:

> somente apresentação.

---

### FinancialFlow

Apresenta a evolução financeira durante o período.

Inicialmente poderá ser implementado como uma lista ou sequência de eventos.

Posteriormente poderá receber uma representação gráfica, caso isso melhore a compreensão dos dados.

Responsabilidade:

> somente apresentação.

---

### BottomNavigation

A navegação principal deverá seguir o padrão de aplicativos mobile.

A navegação inferior será considerada a principal forma de navegação em telas pequenas.

A estrutura inicial poderá conter áreas como:

```text
Início
Lançamentos
Contas
Planejamento
Configurações
```

A estrutura definitiva será definida conforme as próximas funcionalidades forem implementadas.

---

## 8. shadcn/ui

Os componentes visuais deverão utilizar **shadcn/ui** como base.

A biblioteca será utilizada para:

* cards;
* buttons;
* dialogs;
* sheets;
* dropdowns;
* inputs;
* componentes de navegação;
* outros elementos de interface necessários.

Os componentes poderão ser estilizados para criar uma identidade visual própria do aplicativo.

A utilização de shadcn/ui não significa que o Dashboard deverá seguir visualmente o padrão original da biblioteca.

---

## 9. Identidade Visual

O Dashboard deverá transmitir uma sensação de:

* simplicidade;
* organização;
* segurança;
* clareza;
* controle financeiro.

Informações financeiras importantes devem possuir destaque visual.

Entretanto, o uso de cores deve ser controlado.

### Estados financeiros

Valores positivos e negativos deverão possuir diferenciação visual clara.

Por exemplo:

```text
Saldo positivo
→ estado visual positivo

Saldo negativo
→ estado visual de alerta

Limite excedido
→ estado visual de atenção
```

A cor não deve ser o único indicador do estado. Ícones, textos ou outros elementos visuais deverão complementar a informação.

---

## 10. Responsividade

O Dashboard deverá funcionar em:

* smartphones;
* tablets;
* notebooks;
* desktops.

A prioridade de desenvolvimento será:

```text
Mobile
 ↓
Tablet
 ↓
Desktop
```

No mobile, os componentes deverão ocupar predominantemente a largura disponível.

Em telas maiores, os componentes poderão ser organizados em grids e colunas.

---

## 11. PWA

O Dashboard faz parte de uma aplicação PWA.

A experiência deverá ser semelhante à de um aplicativo instalado.

Devemos considerar:

* navegação mobile;
* áreas seguras da tela;
* comportamento adequado durante rolagem;
* carregamento rápido;
* feedback visual durante carregamento;
* estados offline, quando aplicável;
* instalação como aplicativo;
* experiência consistente entre Android, iOS e desktop.

A implementação da infraestrutura PWA será feita em uma etapa própria.

---

## 12. Estados da Interface

O Dashboard deverá possuir pelo menos os seguintes estados:

### Loading

Enquanto os dados financeiros estiverem sendo carregados.

A interface deverá utilizar componentes de carregamento, como skeletons, evitando mudanças bruscas de layout.

---

### Success

Quando os dados forem carregados corretamente.

O Dashboard apresenta os dados financeiros normalmente.

---

### Empty

Quando não houver movimentações financeiras no período.

A interface deverá explicar claramente que ainda não existem movimentações para apresentar.

---

### Error

Quando ocorrer falha na obtenção dos dados.

O usuário deverá receber uma mensagem simples e uma opção para tentar novamente.

Detalhes técnicos não devem ser exibidos ao usuário.

---

## 13. Segurança

Informações financeiras são sensíveis.

A UI deverá evitar exposição desnecessária de informações.

As Actions devem permanecer responsáveis pela autorização e resolução do contexto do usuário.

O frontend não deve receber informações pertencentes a outra família ou membro.

---

## 14. Performance

O Dashboard deve ser otimizado para dispositivos móveis.

Devemos evitar:

* cálculos financeiros no cliente;
* chamadas duplicadas;
* componentes excessivamente complexos;
* renderizações desnecessárias;
* carregamento de bibliotecas sem necessidade.

A apresentação deve permanecer leve mesmo quando o fluxo financeiro possuir muitos registros.

---

## 15. Evolução do Dashboard

A primeira versão será focada nos dados financeiros já disponíveis.

Posteriormente poderão ser adicionados:

* calendário financeiro;
* Dia do Aperto;
* reserva diária;
* gráficos;
* metas;
* alertas financeiros;
* comparação entre períodos;
* indicadores financeiros;
* planejamento futuro.

Essas funcionalidades não devem ser implementadas prematuramente.

Primeiro devemos construir uma base visual sólida utilizando os Contracts e Actions existentes.

---

## 16. Ordem de Implementação

A implementação visual seguirá esta ordem:

```text
1. DashboardPage
       ↓
2. Layout mobile
       ↓
3. Header
       ↓
4. CurrentBalanceCard
       ↓
5. FinancialSummary
       ↓
6. FutureBalanceCard
       ↓
7. FinancialFlow
       ↓
8. BottomNavigation
       ↓
9. Loading / Empty / Error
       ↓
10. Integração com Dashboard Action
       ↓
11. Responsividade
       ↓
12. Refinamento visual
       ↓
13. PWA
```

---

## 17. Princípios Arquiteturais

Durante a implementação do Dashboard, devem ser preservados os seguintes princípios:

1. A UI não calcula dinheiro.
2. A UI não acessa diretamente o Prisma.
3. A UI não acessa diretamente os repositories.
4. Actions são a fronteira de entrada da aplicação.
5. Services coordenam operações.
6. Financial Engine contém as regras financeiras.
7. Domain Models representam conceitos financeiros.
8. Mappers transformam Domain Models em Contracts.
9. Contracts representam os dados expostos à UI.
10. Componentes visuais são responsáveis apenas pela apresentação e interação.

---

## 18. Objetivo da Primeira Versão Visual

A primeira versão do Dashboard não precisa ser definitiva.

O objetivo inicial é criar uma interface:

* funcional;
* mobile first;
* visualmente agradável;
* consistente com shadcn/ui;
* responsiva;
* alimentada pelos Contracts reais;
* sem regras financeiras no frontend;
* preparada para evolução futura.

Após a primeira versão funcional, serão feitos ciclos de refinamento visual e usabilidade.

---

## 19. Decisão

O Dashboard será implementado como uma interface mobile-first de uma PWA, utilizando Next.js, TypeScript e shadcn/ui.

A camada visual consumirá os Contracts produzidos pelas Actions e não duplicará nenhuma regra pertencente ao domínio financeiro.

A arquitetura financeira existente será preservada durante toda a implementação da interface.
