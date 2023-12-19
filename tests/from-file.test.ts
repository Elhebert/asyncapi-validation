import path from 'node:path';
import asyncApiValidation from '../src/index';

describe('parsing `fromFile`', () => {
  it('parse a valid 3.0.0 YAML schema', async () => {
    const validator = asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml')
    );

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('parse a valid 3.0.0 JSON schema', async () => {
    const validator = asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.json')
    );

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('parse a valid 2.0.0 YAML schema', async () => {
    const validator = asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml')
    );

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('parse a valid 2.0.0 JSON schema', async () => {
    const validator = asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.json')
    );

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('throw an error if the YAML schema is not valid', async () => {
    const validator = asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'invalid-schema-3.0.0.yaml')
    );

    await expect(validator).rejects.toThrow(
      'Your schema and/or referenced documents have governance issues.'
    );
  });

  it('throw an error if the JSON schema is not valid', async () => {
    const validator = asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'invalid-schema-3.0.0.json')
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

  it('validate a valid payload for a YAML 3.0.0 schema', async () => {
    const validator = await asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml')
    );

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('validate a valid payload for a JSON 3.0.0 schema', async () => {
    const validator = await asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.json')
    );

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('validate a valid payload for a YAML 2.0.0 schema', async () => {
    const validator = await asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml')
    );

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('validate a valid payload for a JSON 2.0.0 schema', async () => {
    const validator = await asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.json')
    );

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('throw an error if the payload is not valid for a 3.0.0 schema', async () => {
    const validator = await asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml')
    );

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
    const validator = await asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml')
    );

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
    const validator = await asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-3.0.0.yaml')
    );

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
    const validator = await asyncApiValidation.fromFile(
      path.join(__dirname, 'fixtures', 'valid-schema-2.0.0.yaml')
    );

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
});
