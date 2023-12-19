import { readFile } from 'node:fs/promises';
import path from 'node:path';
import asyncApiValidation, { type ValidationFunction } from '../src/index';

describe('AsyncAPI validation', () => {
  describe('parsing `fromUrl`', () => {
    it('parse a yaml 3.0.0 YAML schema', async () => {
      const validator = asyncApiValidation.fromUrl(
        'https://raw.githubusercontent.com/asyncapi/spec/v3.0.0/examples/simple-asyncapi.yml'
      );

      await expect(validator).resolves.toBeInstanceOf(Function);
    });

    it('parse a yaml 2.0.0 YAML schema', async () => {
      const validator = asyncApiValidation.fromUrl(
        'https://raw.githubusercontent.com/asyncapi/spec/v2.0.0/examples/2.0.0/streetlights.yml'
      );

      await expect(validator).resolves.toBeInstanceOf(Function);
    });

    it('throws an error if the URL is not valid', async () => {
      const validator = asyncApiValidation.fromUrl('incorrect-url');

      await expect(validator).rejects.toThrow(
        'Failed to parse URL from incorrect-url'
      );
    });

    it('throws an error if the URL is not returning a valid schema', async () => {
      const validator = asyncApiValidation.fromUrl('https://example.org');

      await expect(validator).rejects.toThrow(
        'Your schema and/or referenced documents have governance issues.'
      );
    });
  });

  describe('parsing `fromFile`', () => {
    it('parse a valid 3.0.0 YAML schema', async () => {
      const validator = asyncApiValidation.fromFile(
        path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml')
      );

      await expect(validator).resolves.toBeInstanceOf(Function);
    });

    it('parse a valid 2.0.0 YAML schema', async () => {
      const validator = asyncApiValidation.fromFile(
        path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml')
      );

      await expect(validator).resolves.toBeInstanceOf(Function);
    });

    it('throw an error if the schema is not valid', async () => {
      const validator = asyncApiValidation.fromFile(
        path.join(__dirname, 'fixtures', 'invalid-schema-3.0.0.yaml')
      );

      await expect(validator).rejects.toThrow(
        'Your schema and/or referenced documents have governance issues.'
      );
    });

    it('throw an error if the schema does not exist', async () => {
      const filePath = path.join(
        __dirname,
        'fixtures',
        'not-existing-schema.yaml'
      );
      const validator = asyncApiValidation.fromFile(filePath);

      await expect(validator).rejects.toThrow(
        `ENOENT: no such file or directory, open '${filePath}'`
      );
    });
  });

  describe('parsing `fromSchema`', () => {
    it('parse a valid 3.0.0 YAML schema', async () => {
      const schema = await readFile(
        path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml'),
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

    it('throw an error if the schema is not valid', async () => {
      const schema = await readFile(
        path.join(__dirname, 'fixtures', 'invalid-schema-3.0.0.yaml'),
        'utf-8'
      );
      const validator = asyncApiValidation.fromSchema(schema);

      await expect(validator).rejects.toThrow(
        'Your schema and/or referenced documents have governance issues.'
      );
    });
  });

  describe('validation', () => {
    let validator3: ValidationFunction;
    let validator2: ValidationFunction;

    beforeAll(async () => {
      validator3 = await asyncApiValidation.fromFile(
        path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml')
      );

      validator2 = await asyncApiValidation.fromFile(
        path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml')
      );
    });

    it('validate a valid payload for a 3.0.0 schema', async () => {
      const payload = {
        lumens: 500,
        sendAt: '2020-08-06T15:00:00+00:00',
      };

      expect(validator3('lightMeasured', payload)).toBe(true);
    });

    it('throw an error if the payload is not valid for a 3.0.0 schema', async () => {
      const payload = {
        lumens: -100,
        sendAt: '2020-08-06T15:00:00+00:00',
      };

      try {
        validator3('lightMeasured', payload);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect((err as Error).message).toBe('data/lumens must be >= 0');
      }
    });

    it('validate a valid payload for a 2.0.0 schema', async () => {
      const payload = {
        lumens: 500,
        sendAt: '2020-08-06T15:00:00+00:00',
      };

      expect(validator2('lightMeasured', payload)).toBe(true);
    });

    it('throw an error if the payload is not valid for a 2.0.0 schema', async () => {
      const payload = {
        lumens: -100,
        sendAt: '2020-08-06T15:00:00+00:00',
      };

      try {
        validator2('lightMeasured', payload);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect((err as Error).message).toBe('data/lumens must be >= 0');
      }
    });
  });
});
