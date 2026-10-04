# Dashboard Financeiro

## 1. Objetivo

O Dashboard é a principal área de acompanhamento financeiro do usuário após a autenticação.

Seu objetivo é apresentar, de forma simples e rápida, a situação financeira atual e a projeção dos próximos compromissos.

O usuário deve conseguir responder rapidamente:

* Quanto dinheiro tenho agora?
* Quanto terei depois dos próximos lançamentos?
* Quanto ainda vou receber?
* Quanto ainda vou gastar?
* Em que momento minha situação financeira ficará crítica?
* Quanto preciso reservar diariamente?
* Quais movimentações estão previstas?
* Em quais dias existe risco de saldo insuficiente?

O Dashboard não realiza cálculos financeiros próprios.

Os valores apresentados são resultados processados pelas camadas de domínio e aplicação, tendo o Financial Engine como autoridade para as regras financeiras.

---

# 2. Princípio arquitetural

A interface do Dashboard é responsável por:

```text
Obter
   ↓
Organizar
   ↓
Apresentar
```

Ela não é responsável por:

```text
Calcular
Validar regras financeiras
Projetar valores por conta própria
```

O fluxo esperado é:

```text
Banco de dados
      ↓
Repository
      ↓
Service / Action
      ↓
Financial Engine
      ↓
Contrato / DTO
      ↓
Dashboard
      ↓
Interface
```

Essa separação garante que as regras financeiras permaneçam centralizadas.

---

# 3. Acesso

O Dashboard é uma área autenticada.

O usuário deve possuir uma sessão válida para acessar:

```text
/dashboard
```

Usuários não autenticados devem ser impedidos de acessar a área protegida.

A autenticação é responsabilidade do módulo de Authentication e não do Dashboard.

---

# 4. Estrutura visual

O Dashboard seguirá uma abordagem mobile-first.

A organização inicial da informação será:

```text
┌──────────────────────────────┐
│ Saudação / usuário           │
├──────────────────────────────┤
│ Saldo atual                  │
├──────────────────────────────┤
│ Saldo futuro                 │
│ Receitas futuras             │
│ Despesas futuras             │
├──────────────────────────────┤
│ Reserva diária               │
├──────────────────────────────┤
│ Dia do Aperto                │
├──────────────────────────────┤
│ Calendário financeiro        │
├──────────────────────────────┤
│ Fluxo financeiro             │
└──────────────────────────────┘
```

Em telas maiores, os componentes poderão ser reorganizados em colunas e cards sem alterar as informações ou regras de negócio.

---

# 5. Saldo atual

O Dashboard deverá apresentar o saldo disponível no momento atual.

Exemplo:

```text
Saldo atual

R$ 1.000,00
```

O valor deve ser fornecido pela camada responsável pelo cálculo financeiro.

O componente visual não deverá recalcular o saldo.

---

# 6. Saldo futuro

O saldo futuro representa a projeção do saldo considerando as transações posteriores à data de referência.

Exemplo:

```text
Saldo atual:       R$ 1.000,00
Receitas futuras:  R$ 1.000,00
Despesas futuras:  R$   300,00

Saldo futuro:      R$ 1.700,00
```

A fórmula e as regras utilizadas para determinar esse valor pertencem ao Financial Engine.

A interface apenas apresenta o resultado.

---

# 7. Receitas futuras

O Dashboard deverá apresentar o total das receitas consideradas futuras pelo domínio financeiro.

Exemplo:

```text
Receitas futuras

+ R$ 1.000,00
```

Somente transações classificadas pelo domínio como futuras devem compor esse valor.

A definição de transação futura pertence à:

```text
FutureTransactionRule
```

---

# 8. Despesas futuras

O Dashboard deverá apresentar o total das despesas futuras.

Exemplo:

```text
Despesas futuras

- R$ 300,00
```

Assim como nas receitas futuras, a interface não deverá determinar quais transações são futuras.

Essa responsabilidade pertence ao domínio financeiro.

---

# 9. Situação do saldo futuro

O Dashboard deverá apresentar visualmente se a projeção financeira é positiva ou negativa.

### Saldo positivo

Quando o saldo futuro for maior ou igual a zero, o Dashboard deverá indicar uma situação financeira positiva.

### Saldo negativo

Quando o saldo futuro for inferior a zero, o Dashboard deverá destacar a situação de risco.

Exemplo:

```text
Saldo futuro

- R$ 150,00

Saldo insuficiente previsto
```

A determinação de saldo positivo ou negativo deverá utilizar o resultado fornecido pelo domínio.

---

# 10. Reserva diária

O Dashboard deverá apresentar quanto o usuário precisa reservar diariamente para cumprir seus compromissos financeiros futuros.

Exemplo:

```text
Reserva diária

R$ 75,00 por dia
```

A regra de cálculo da reserva diária será definida pelo domínio financeiro.

A interface apenas apresenta o resultado.

Caso a funcionalidade ainda não esteja disponível no Financial Engine, o componente deverá permanecer preparado para receber o valor posteriormente, sem implementar uma regra paralela.

---

# 11. Dia do Aperto

O Dashboard deverá destacar o primeiro momento projetado em que a situação financeira do usuário atingir uma condição crítica.

Exemplo:

```text
Dia do Aperto

15 de agosto

Saldo projetado insuficiente
```

O cálculo do Dia do Aperto pertence ao domínio financeiro.

A interface deverá apenas apresentar:

* data;
* saldo projetado;
* indicador de risco;
* mensagem apropriada.

Quando não houver Dia do Aperto no período analisado, a interface deverá apresentar uma situação positiva.

Exemplo:

```text
Dia do Aperto

Nenhum período crítico previsto.
```

---

# 12. Calendário financeiro

O Dashboard deverá possuir uma representação visual dos principais eventos financeiros ao longo do período.

Exemplo:

```text
Agosto

10   11   12   13   14   15   16
+         -              !    -
```

Os dias poderão apresentar indicadores para:

* receitas;
* despesas;
* saldo positivo;
* saldo negativo;
* compromissos;
* Dia do Aperto.

O calendário não deverá calcular o saldo de cada dia independentemente.

Os dados devem ser fornecidos pela camada financeira.

---

# 13. Fluxo financeiro

O Dashboard deverá apresentar a evolução financeira ao longo do período.

Exemplo:

```text
10/08
Receita       + R$ 1.000,00
Saldo           R$ 2.000,00

15/08
Despesa       - R$   500,00
Saldo           R$ 1.500,00
```

O cálculo do fluxo financeiro é responsabilidade do:

```text
FinancialFlowEngine
```

O Dashboard apenas transforma os resultados em uma representação visual adequada.

---

# 14. Estado sem movimentações

Quando não existirem transações no período, o Dashboard não deverá apresentar uma interface quebrada ou vazia.

Deverá apresentar uma mensagem orientando o usuário.

Exemplo:

```text
Nenhuma movimentação encontrada.

Comece registrando uma receita ou despesa.
```

Os valores financeiros deverão permanecer consistentes com a ausência de movimentações.

---

# 15. Estado de carregamento

Durante a obtenção dos dados, o Dashboard deverá apresentar um estado de carregamento.

O objetivo é evitar que o usuário interprete valores ausentes como valores financeiros reais.

O carregamento poderá utilizar:

* skeletons;
* placeholders;
* indicadores de carregamento.

A implementação visual poderá evoluir posteriormente.

---

# 16. Estado de erro

Caso não seja possível carregar os dados financeiros, o Dashboard deverá apresentar uma mensagem clara.

Exemplo:

```text
Não foi possível carregar seu resumo financeiro.

Tente novamente.
```

Informações técnicas ou detalhes internos da aplicação não devem ser apresentados diretamente ao usuário.

---

# 17. Responsividade

O Dashboard deverá ser desenvolvido seguindo a abordagem mobile-first.

### Mobile

A prioridade será:

1. leitura rápida;
2. cards empilhados;
3. navegação simples;
4. elementos grandes o suficiente para interação por toque;
5. pouca informação simultânea na tela.

### Desktop

Em telas maiores, os componentes poderão utilizar:

* grids;
* múltiplas colunas;
* cards lado a lado;
* maior área para calendário;
* maior área para fluxo financeiro.

A mudança de layout não deverá alterar as regras financeiras.

---

# 18. Acessibilidade

Os componentes deverão considerar:

* contraste adequado;
* textos legíveis;
* labels em campos interativos;
* navegação por teclado;
* elementos semânticos;
* estados de erro compreensíveis;
* indicadores que não dependam somente de cor.

Por exemplo, um saldo negativo não deverá ser identificado somente pela cor vermelha.

Deverá existir também uma indicação textual ou visual complementar.

---

# 19. Responsabilidade das Actions

O Dashboard deverá utilizar as Actions financeiras existentes.

Atualmente:

```text
src/actions/financial/

calculate-financial-flow.action.ts
calculate-future-balance.action.ts
calculate-summary.actions.ts
get-financial-dashboard.action.ts
```

A Action de Dashboard deverá ser priorizada quando fornecer todas as informações necessárias para a tela.

O objetivo é reduzir chamadas redundantes e manter o fluxo de dados organizado.

---

# 20. Contratos

Os dados apresentados pelo Dashboard deverão utilizar contratos existentes ou novos contratos específicos quando necessário.

Entre os contratos já existentes estão:

```text
src/contracts/financial/

dashboard.contract.ts
financial-flow.contract.ts
financial-summary.contract.ts
future-balance.contract.ts
transaction-summary.contract.ts
```

Os contratos devem representar dados destinados à camada de aplicação/interface e não devem conter regras de cálculo.

---

# 21. Organização dos componentes

Componentes específicos do Dashboard deverão permanecer em:

```text
src/features/dashboard/
```

A página:

```text
src/app/dashboard/page.tsx
```

será o ponto de entrada da rota.

A estrutura poderá evoluir para algo semelhante a:

```text
src/features/dashboard/

components/
├── dashboard-header
├── current-balance
├── future-balance
├── financial-summary
├── daily-reserve
├── tight-day
├── financial-calendar
└── financial-flow

services/
actions/
types/
```

A estrutura definitiva será definida durante a implementação conforme a complexidade real dos componentes.

---

# 22. Testes

O Dashboard deverá ser validado em diferentes níveis.

### Domínio

As regras financeiras continuam sendo testadas no domínio.

### Actions

As Actions deverão possuir testes quando possuírem comportamento relevante.

### Componentes

Componentes que possuam comportamento ou regras de apresentação importantes poderão receber testes.

### Integração

Fluxos críticos poderão receber testes de integração.

### Build

Antes do merge da funcionalidade deverão passar:

```text
npm test
```

e:

```text
npm run build
```

---

# 23. Regra fundamental sobre cálculos

Esta é uma regra arquitetural obrigatória:

> O Dashboard nunca deve se tornar uma segunda implementação do Financial Engine.

Por exemplo, não devemos implementar dentro de um componente:

```ts
const futureBalance =
  currentBalance +
  futureIncome -
  futureExpenses;
```

se esse valor já é responsabilidade do Financial Engine.

O componente deve receber:

```ts
futureBalance
```

e apenas apresentá-lo.

Essa regra protege a consistência financeira da aplicação.

---

# 24. Evoluções futuras

O Dashboard poderá posteriormente receber:

* gráficos;
* filtros por conta;
* filtros por período;
* comparação entre períodos;
* indicadores personalizados;
* notificações financeiras;
* alertas;
* metas financeiras;
* insights;
* recursos de inteligência artificial.

A inclusão de IA não deverá alterar a responsabilidade do Financial Engine.

A IA poderá interpretar informações financeiras já calculadas e apresentar insights, mas não deverá substituir as regras determinísticas do sistema financeiro.

---

# 25. Relação com outras funcionalidades

O Dashboard depende conceitualmente de várias áreas do sistema:

```text
Authentication
      ↓
     User
      ↓
    Family
      ↓
 FamilyMember
      ↓
   Accounts
      ↓
 Transactions
      ↓
Financial Engine
      ↓
   Dashboard
```

Isso significa que o Dashboard é uma camada de apresentação e consolidação das funcionalidades financeiras existentes.

---

# 26. Critérios de conclusão do MVP

A funcionalidade Dashboard será considerada concluída quando:

* [ ] Usuário autenticado conseguir acessar `/dashboard`;
* [ ] Usuário não autenticado não conseguir acessar `/dashboard`;
* [ ] Saldo atual for apresentado;
* [ ] Saldo futuro for apresentado;
* [ ] Receitas futuras forem apresentadas;
* [ ] Despesas futuras forem apresentadas;
* [ ] Situação positiva/negativa for apresentada;
* [ ] Fluxo financeiro for apresentado;
* [ ] Calendário financeiro inicial estiver implementado;
* [ ] Estados de carregamento forem tratados;
* [ ] Estados de erro forem tratados;
* [ ] Estado sem movimentações for tratado;
* [ ] Interface estiver adequada para mobile;
* [ ] Interface estiver adequada para desktop;
* [ ] Nenhum cálculo financeiro estiver duplicado na UI;
* [ ] Testes relevantes estiverem passando;
* [ ] Suíte completa de testes estiver passando;
* [ ] `npm run build` estiver passando.

---

# 27. Status

```text
Documentação:        CONCLUÍDA
Arquitetura:         DEFINIDA
Implementação:       PENDENTE
Testes:              PENDENTE
Responsividade:      PENDENTE
Build:               PENDENTE
```

O Dashboard será implementado incrementalmente nesta branch:

```text
feature/dashboard
```
