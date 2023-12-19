# AsyncAPI validation

[![Unit tests](https://github.com/Elhebert/asyncapi-validation/actions/workflows/unit-test.yml/badge.svg)](https://github.com/Elhebert/asyncapi-validation/actions/workflows/unit-test.yml)
[![codecov](https://codecov.io/gh/Elhebert/asyncapi-validation/graph/badge.svg?token=7QFPVL5DKN)](https://codecov.io/gh/Elhebert/asyncapi-validation)

Message validation package for YAML and JSON AsyncAPI documents.

This package is compatible with AsyncAPI documents v2.x.x and v3.0.0.

## Installation

```bash
# NPM
npm install asyncapi-validation
# Yarn
yarn add asyncapi-validation
# PNPM
pnpm install asyncapi-validation
```

## Usage

### Using a remote schema

```ts
import asyncAPIValidation from 'asyncapi-validation';

const validator = await asyncAPIValidation.fromUrl(
  'https://example.org/schema.yaml'
);
validator('messageName', { foo: 'bar' });
validator('messageId', { foo: 'bar' });
```

# Using a local schema

```ts
const validator = await asyncAPIValidation.fromUrl('./schema.yaml');
validator('messageName', { foo: 'bar' });
validator('messageId', { foo: 'bar' });
```

# Using an in-line schema

```ts
const validator = await asyncAPIValidation.fromSchema(`asyncapi: 3.0.0
info:
  title: Account Service
  version: 1.0.0
  description: This service is in charge of processing user signups
channels:
  userSignedup:
    address: user/signedup
    messages:
      UserSignedUp:
        $ref: '#/components/messages/UserSignedUp'
operations:
  sendUserSignedup:
    action: send
    channel:
      $ref: '#/channels/userSignedup'
    messages:
      - $ref: '#/channels/userSignedup/messages/UserSignedUp'
components:
  messages:
    UserSignedUp:
      payload:
        type: object
        properties:
          displayName:
            type: string
            description: Name of the user
          email:
            type: string
            format: email
            description: Email of the user
`);
validator('messageName', { foo: 'bar' });
validator('messageId', { foo: 'bar' });
```

## Contributing

### Tests

The test suite can be run using pnpm scripts:

```bash
pnpm test
```

Tests can be found in the (tests)[./tests] folder.

### Linting

The following pnpm script can be used to find out about the possible linting errors:

```bash
pnpm lint
```

### Linting error prevention

[Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) are set up to check staged files for linting issues. When new changes are commited all the updated files will be checked. If the linting fails for one of them the operation will be cancelled.

## Built with

- [NodeJs](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [AsyncAPI parser](https://www.asyncapi.com/tools/parsers)
- [Ajv js](https://ajv.js.org/)
