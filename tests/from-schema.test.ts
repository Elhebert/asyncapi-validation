import path from 'node:path';
import { readFile } from 'node:fs/promises';
import asyncApiValidation from '../src/index';

describe('parsing `fromSchema`', () => {
  it('parse a valid 3.0.0 YAML schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml'),
      'utf-8'
    );
    const validator = asyncApiValidation.fromSchema(schema);

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('parse a valid 3.0.0 JSON schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.json'),
      'utf-8'
    );
    const validator = asyncApiValidation.fromSchema(schema);

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('parse a valid 2.0.0 YAML schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml'),
      'utf-8'
    );
    const validator = asyncApiValidation.fromSchema(schema);

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('parse a valid 2.0.0 JSON schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.json'),
      'utf-8'
    );
    const validator = asyncApiValidation.fromSchema(schema);

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('throw an error if the YAML schema is not valid', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'invalid-schema-3.0.0.yaml'),
      'utf-8'
    );
    const validator = asyncApiValidation.fromSchema(schema);

    await expect(validator).rejects.toThrow(
      'Your schema and/or referenced documents have governance issues.'
    );
  });

  it('throw an error if the JSON schema is not valid', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'invalid-schema-3.0.0.json'),
      'utf-8'
    );
    const validator = asyncApiValidation.fromSchema(schema);

    await expect(validator).rejects.toThrow(
      'Your schema and/or referenced documents have governance issues.'
    );
  });

  it('throw an error if the schema is not an AsyncAPI schema', async () => {
    const validator = asyncApiValidation.fromSchema('Not a valid schema');

    await expect(validator).rejects.toThrow(
      `Your schema is not an AsyncAPI schema.`
    );
  });

  it('validate a valid payload for a YAML 3.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('validate a valid payload for a JSON 3.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.json'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('validate a valid payload for a YAML 2.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('validate a valid payload for a JSON 2.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.json'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('throw an error if the payload is not valid for a 3.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      lumens: -100,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    try {
      validator('lightMeasured', payload);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe('data/lumens must be >= 0');
    }
  });

  it('throw an error if the payload is not valid for a 2.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      lumens: -100,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    try {
      validator('lightMeasured', payload);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe('data/lumens must be >= 0');
    }
  });

  it('throw an error if the message key is not found for a 3.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      lumens: 10,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    try {
      validator('wrong-key', payload);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe(
        'No messages found for the given key'
      );
    }
  });

  it('throw an error if the message key is not found for a 2.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      lumens: 10,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    try {
      validator('wrong-key', payload);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe(
        'No messages found for the given key'
      );
    }
  });

  it('validate an openapi schema inside a valid Async API 3.0.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-openapi-3.0.0.yaml'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      name: 'Fran',
    };

    expect(validator('testMessage', payload)).toBe(true);
  });

  it('validate an openapi schema inside a valid Async API 2.4.0 schema', async () => {
    const schema = await readFile(
      path.join(__dirname, 'fixtures', 'valid-schema-openapi-2.4.0.yaml'),
      'utf-8'
    );
    const validator = await asyncApiValidation.fromSchema(schema);

    const payload = {
      name: 'Fran',
    };

    expect(validator('testMessage', payload)).toBe(true);
  });
});
