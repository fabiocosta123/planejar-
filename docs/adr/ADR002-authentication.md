# ADR002 — Authentication

## Status

Accepted

## Date

2026-08-08

## Context

O sistema precisa permitir que usuários acessem suas contas de forma segura e que áreas protegidas da aplicação sejam acessíveis somente após autenticação.

A aplicação utiliza Next.js com TypeScript e precisa manter a autenticação integrada ao fluxo de navegação da aplicação, permitindo também que a sessão do usuário seja utilizada posteriormente para identificar o usuário autenticado e determinar suas permissões.

Além disso, as credenciais do usuário não devem ser armazenadas em texto puro.

## Decision

Será utilizado o NextAuth para gerenciamento da autenticação e das sessões da aplicação.

A autenticação inicial será realizada utilizando o provider Credentials, permitindo login através de e-mail e senha.

As senhas serão armazenadas somente na forma de hash utilizando bcrypt.

A sessão utilizará estratégia JWT.

O fluxo de autenticação será dividido entre:

* configuração da autenticação;
* serviço de autenticação;
* serviço de usuários;
* repositório de usuários;
* validação de senha;
* middleware de proteção das rotas;
* páginas de login e áreas autenticadas.

A autenticação será responsável somente por autenticar e identificar o usuário. Regras de negócio financeiras permanecerão no domínio da aplicação.

## Authentication Flow

O fluxo será:

1. O usuário acessa a página de login.
2. O usuário informa e-mail e senha.
3. NextAuth recebe as credenciais.
4. O serviço de usuários busca o usuário pelo e-mail.
5. O sistema verifica se o usuário está ativo.
6. O sistema verifica a existência do hash da senha.
7. A senha informada é comparada com o hash utilizando bcrypt.
8. Caso as credenciais sejam válidas, o usuário é autenticado.
9. Uma sessão JWT é criada.
10. O usuário é direcionado para o Dashboard.
11. O middleware protege as rotas autenticadas.

Credenciais inválidas ou usuários inativos não devem resultar em uma sessão autenticada.

## Password Security

As senhas nunca serão armazenadas diretamente no banco de dados.

O sistema utilizará:

```text
Senha
  ↓
bcrypt
  ↓
passwordHash
  ↓
Banco de dados
```

Durante o login:

```text
Senha informada
  ↓
bcrypt.compare()
  ↓
passwordHash armazenado
  ↓
válida / inválida
```

O sistema não deve possuir nenhuma funcionalidade que permita recuperar a senha original.

## Protected Routes

As rotas que exigem autenticação serão protegidas pelo middleware.

Atualmente, a área principal protegida é:

```text
/dashboard
```

Usuários não autenticados que tentarem acessar uma rota protegida deverão ser direcionados para o fluxo de autenticação.

## Architectural Separation

A autenticação não deverá conter regras financeiras.

A separação será:

```text
Authentication
      │
      ├── identifica usuário
      ├── cria sessão
      └── protege acesso
             │
             ▼
        Application
             │
             ▼
          Domain
             │
             ▼
     Financial Engine
```

Dessa forma, a autenticação não interfere nos cálculos financeiros e o Financial Engine permanece como autoridade para as regras financeiras.

## Consequences

### Positive

* Autenticação centralizada.
* Sessão baseada em JWT.
* Senhas armazenadas de forma segura.
* Rotas protegidas.
* Separação entre autenticação e regras de negócio.
* Possibilidade de evolução futura para outros providers.
* Identidade do usuário disponível para as funcionalidades autenticadas.

### Negative

* A aplicação passa a depender do NextAuth.
* A estratégia JWT exige atenção à evolução das informações armazenadas na sessão.
* Alterações futuras de autorização poderão exigir uma camada adicional de controle de permissões.

## Future Considerations

A autenticação atual atende ao MVP.

Funcionalidades futuras poderão incluir:

* recuperação de senha;
* confirmação de e-mail;
* autenticação social;
* autenticação de dois fatores;
* controle de permissões;
* gerenciamento de sessões;
* encerramento de sessões em outros dispositivos.

Essas funcionalidades deverão ser adicionadas sem transferir responsabilidades de negócio para a camada de autenticação.

## Related Components

Principais componentes envolvidos:

```text
src/
├── app/
│   ├── api/auth/[...nextauth]/
│   ├── login/
│   └── dashboard/
│
├── lib/
│   ├── auth.ts
│   ├── auth.config.ts
│   └── password.ts
│
├── services/
│   └── users.service.ts
│
├── repositories/
│   └── user.repository.ts
│
└── middleware.ts
```

## Validation

A implementação foi validada através de:

* testes unitários de hash de senha;
* testes de validação de senha;
* testes do UsersService;
* autenticação real através da página de login;
* acesso autenticado ao Dashboard;
* proteção da rota `/dashboard`;
* execução completa da suíte de testes;
* `npm run build`.

Status da implementação:

```text
Authentication: COMPLETED
Tests: PASSING
Build: PASSING
```
