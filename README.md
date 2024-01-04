# AsyncAPI validation

[![Unit tests](https://github.com/Elhebert/asyncapi-validation/actions/workflows/unit-test.yml/badge.svg)](https://github.com/Elhebert/asyncapi-validation/actions/workflows/unit-test.yml)
[![codecov](https://codecov.io/gh/Elhebert/asyncapi-validation/graph/badge.svg?token=7QFPVL5DKN)](https://codecov.io/gh/Elhebert/asyncapi-validation)
[![CodeQL](https://github.com/Elhebert/asyncapi-validation/actions/workflows/codeql.yml/badge.svg)](https://github.com/Elhebert/asyncapi-validation/actions/workflows/codeql.yml)

Message validation package for YAML and JSON AsyncAPI documents.

This package:

- Load and parse your AsyncAPI documents from a file, an url or an in-line schema
- Support AsyncAPI documents v2.x.x and v3.x.x
- Support both YAML and JSON documents

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

### Parsing Functions

<dl>
<dt><a href="#fromFile">fromFile(path)</a> ⇒ <code>Promise.&lt;ValidationFunction&gt;</code></dt>
<dd><p>Parses an AsyncAPI schema from a file and returns a validation function.</p>
</dd>
<dt><a href="#fromUrl">fromUrl(url)</a> ⇒ <code>Promise.&lt;ValidationFunction&gt;</code></dt>
<dd><p>Parses an AsyncAPI schema from a URL and returns a validation function.</p>
</dd>
<dt><a href="#fromSchema">fromSchema(schema)</a> ⇒ <code>Promise.&lt;ValidationFunction&gt;</code></dt>
<dd><p>Parses an AsyncAPI schema from a string and returns a validation function.</p>
</dd>
</dl>

<a name="fromFile"></a>

#### fromFile(path) ⇒ <code>Promise.&lt;ValidationFunction&gt;</code>

Parses an AsyncAPI schema from a file and returns a validation function.

**Kind**: global function
**Returns**: <code>Promise.&lt;ValidationFunction&gt;</code> - A promise that resolves to the validation function.
**Throws**:

- <code>AsyncAPIParsingError</code> if the schema is not valid or has governance issues.

| Param | Type                | Description                           |
| ----- | ------------------- | ------------------------------------- |
| path  | <code>string</code> | The path to the AsyncAPI schema file. |

**Example**

```js
const validator = await asyncApiValidation.parseFromFile('path/to/schema.yaml');
validator('messageKey', { foo: 'bar' });
```

<a name="fromUrl"></a>

#### fromUrl(url) ⇒ <code>Promise.&lt;ValidationFunction&gt;</code>

Parses an AsyncAPI schema from a URL and returns a validation function.

**Kind**: global function
**Returns**: <code>Promise.&lt;ValidationFunction&gt;</code> - A promise that resolves to the validation function.
**Throws**:

- <code>AsyncAPIParsingError</code> if the schema is not valid or has governance issues.

| Param | Type                | Description                     |
| ----- | ------------------- | ------------------------------- |
| url   | <code>string</code> | The URL of the AsyncAPI schema. |

**Example**

```js
const validator = await asyncApiValidation.fromUrl(
  'https://example.org/schema.yaml'
);
validator('messageKey', { foo: 'bar' });
```

<a name="fromSchema"></a>

#### fromSchema(schema) ⇒ <code>Promise.&lt;ValidationFunction&gt;</code>

Parses an AsyncAPI schema from a string and returns a validation function.

**Kind**: global function
**Returns**: <code>Promise.&lt;ValidationFunction&gt;</code> - A promise that resolves to the validation function.
**Throws**:

- <code>AsyncAPIParsingError</code> if the schema is not valid or has governance issues.

| Param  | Type                | Description                      |
| ------ | ------------------- | -------------------------------- |
| schema | <code>string</code> | The AsyncAPI schema as a string. |

**Example**

```js
const validator = await asyncApiValidation.fromSchema('asyncapi: 2.0.0');
validator('messageKey', { foo: 'bar' });
```

### Validator Function

<a name="validate"></a>

#### validate(schema) ⇒ <code>ValidationFunction</code>

Validates the provided AsyncAPI schema and returns a validation function.

**Kind**: global function
**Returns**: <code>ValidationFunction</code> - The validation function.

| Param  | Type                     | Description                 |
| ------ | ------------------------ | --------------------------- |
| schema | <code>ParseOutput</code> | The parsed AsyncAPI schema. |

<a name="validate..validatorFunction"></a>

##### validate~validatorFunction(key, payload) ⇒ <code>boolean</code>

Validates the provided payload against the AsyncAPI schema.

**Kind**: inner method of [<code>validate</code>](#validate)
**Returns**: <code>boolean</code> - true if the payload is valid.
**Throws**:

- <code>Error</code> if no messages are found for the given key.
- <code>AsyncAPIValidationError</code> if the payload fails validation.

| Param   | Type                 | Description                         |
| ------- | -------------------- | ----------------------------------- |
| key     | <code>string</code>  | The key of the message to validate. |
| payload | <code>unknown</code> | The payload to validate.            |

**Example**

```js
const validator = await asyncApiValidation.fromSchema('asyncapi: 2.0.0');
validator('messageKey', { foo: 'bar' });
```

### Errors

<a name="AsyncAPIParsingError"></a>

#### AsyncAPIParsingError

Represents an error that occurs during the parsing of an AsyncAPI document.

**Kind**: global class
<a name="new_AsyncAPIParsingError_new"></a>

##### new AsyncAPIParsingError(message, [errors])

Represents an error that occurs during the parsing of an AsyncAPI document.

| Param    | Type                                  | Description                                                            |
| -------- | ------------------------------------- | ---------------------------------------------------------------------- |
| message  | <code>string</code>                   | The error message.                                                     |
| [errors] | <code>Array.&lt;Diagnostic&gt;</code> | Optional array of diagnostic errors associated with the parsing error. |

<a name="AsyncAPIValidationError"></a>

#### AsyncAPIValidationError

Represents an error that occurs during AsyncAPI validation.

**Kind**: global class
<a name="new_AsyncAPIValidationError_new"></a>

##### new AsyncAPIValidationError(message, key, [errors])

Represents an error that occurs during AsyncAPI validation.

| Param    | Type                                                        | Description                            |
| -------- | ----------------------------------------------------------- | -------------------------------------- |
| message  | <code>string</code>                                         | The error message.                     |
| key      | <code>string</code>                                         | The key associated with the error.     |
| [errors] | <code>Array.&lt;ErrorObject&gt;</code> \| <code>null</code> | The array of validation error objects. |
