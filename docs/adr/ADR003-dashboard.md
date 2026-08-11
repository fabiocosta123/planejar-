# ADR003 — Dashboard

## Status

Accepted

## Date

2026-08-11

## Context

O Dashboard será a principal área de acompanhamento financeiro do usuário após a autenticação.

Ele deverá apresentar uma visão consolidada da situação financeira atual e das projeções futuras, permitindo que o usuário compreenda rapidamente sua disponibilidade financeira e identifique períodos de risco.

O sistema já possui o Financial Engine, responsável pelas regras e cálculos financeiros. Portanto, o Dashboard não deve duplicar essas regras na camada de apresentação.

## Decision

O Dashboard será implementado como uma funcionalidade independente dentro de:

```text
src/features/dashboard/
```

A rota será disponibilizada através de:

```text
src/app/dashboard/
```

A interface seguirá uma abordagem **mobile-first**, sendo posteriormente adaptada para telas maiores.

O Dashboard será responsável pela apresentação dos dados, enquanto os cálculos permanecerão nas camadas de domínio e aplicação.

## Responsibilities

O Dashboard deverá apresentar, inicialmente:

* saldo atual;
* saldo futuro;
* receitas futuras;
* despesas futuras;
* fluxo financeiro;
* calendário financeiro;
* Dia do Aperto;
* reserva diária;
* indicadores financeiros relevantes.

## Financial Calculation Rule

O Dashboard não poderá realizar cálculos financeiros diretamente.

Não serão implementadas regras como:

```text
saldo = receitas - despesas
```

ou:

```text
saldo futuro = saldo atual + receitas - despesas
```

dentro de componentes React.

Esses cálculos deverão ser realizados pelo Financial Engine.

O fluxo será:

```text
Database
    ↓
Repository
    ↓
Service / Action
    ↓
Financial Engine
    ↓
Contract / DTO
    ↓
Dashboard
    ↓
UI
```

A interface será responsável somente por apresentar os resultados.

## Existing Application Actions

O Dashboard deverá aproveitar as Actions financeiras já existentes:

```text
src/actions/financial/

calculate-financial-flow.action.ts
calculate-future-balance.action.ts
calculate-summary.actions.ts
get-financial-dashboard.action.ts
```

Sempre que possível, será priorizada a Action de Dashboard para obter os dados necessários em uma única operação, evitando chamadas redundantes.

## Component Architecture

A funcionalidade específica do Dashboard deverá permanecer em:

```text
src/features/dashboard/
```

A rota:

```text
src/app/dashboard/page.tsx
```

deverá atuar principalmente como ponto de entrada da página.

Componentes reutilizáveis de interface deverão permanecer na estrutura compartilhada de UI quando não forem específicos do Dashboard.

## Mobile First

A primeira versão da interface será projetada para dispositivos móveis.

A ordem visual deverá priorizar:

1. saldo atual;
2. saldo futuro;
3. situação financeira;
4. próximos compromissos;
5. calendário;
6. fluxo financeiro;
7. informações complementares.

Em telas maiores, os mesmos dados poderão ser reorganizados utilizando uma estrutura de múltiplas colunas.

## User Experience

O Dashboard deverá permitir que o usuário compreenda sua situação financeira rapidamente, sem precisar interpretar cálculos manualmente.

Indicadores visuais deverão ser utilizados para destacar:

* saldo positivo;
* saldo negativo;
* aproximação de compromissos;
* Dia do Aperto;
* necessidade de reserva;
* períodos com risco financeiro.

As informações deverão permanecer claras tanto em dispositivos móveis quanto em desktop.

## Architectural Boundaries

O Dashboard não será responsável por:

* calcular saldo;
* calcular receitas;
* calcular despesas;
* determinar regras financeiras;
* modificar diretamente o banco de dados;
* implementar regras pertencentes ao Financial Engine.

Sua responsabilidade será:

```text
Obter
  ↓
Organizar
  ↓
Apresentar
```

## Consequences

### Positive

* Separação clara entre domínio e apresentação.
* Menor risco de duplicação de regras financeiras.
* Dashboard mais simples de testar.
* Facilidade para evoluir a interface.
* Compatibilidade com a estratégia mobile-first.
* Possibilidade de reutilizar os mesmos resultados em futuras interfaces.

### Negative

* A interface dependerá dos contratos fornecidos pelas camadas superiores.
* Mudanças nas regras financeiras deverão respeitar os contratos existentes.
* Alguns componentes poderão exigir estados específicos para carregamento e erro.

## Future Considerations

O Dashboard poderá posteriormente incorporar:

* gráficos financeiros;
* filtros por conta;
* filtros por período;
* comparação entre períodos;
* indicadores personalizados;
* notificações;
* insights gerados por IA.

A IA não deverá substituir o Financial Engine nem executar cálculos financeiros.

Quando recursos de IA forem adicionados, eles deverão consumir dados já processados pelo sistema financeiro.

## Related Components

Estrutura inicial:

```text
src/
├── app/
│   └── dashboard/
│       └── page.tsx
│
├── features/
│   └── dashboard/
│
├── actions/
│   └── financial/
│       └── get-financial-dashboard.action.ts
│
└── domain/
    └── financial/
        └── engine/
            ├── financial-engine.ts
            └── financial-flow-engine.ts
```

## Validation

A implementação do Dashboard deverá ser validada através de:

* testes dos componentes críticos;
* testes das Actions utilizadas;
* testes de integração quando necessário;
* validação da proteção da rota;
* validação mobile;
* validação desktop;
* execução completa da suíte de testes;
* `npm run build`.

## Implementation Status

```text
Architecture: ACCEPTED
Documentation: CREATED
Implementation: PENDING
Tests: PENDING
```
