import asyncApiValidation from '../src/index';

describe('parsing `fromUrl`', () => {
  it('parse a valid 3.0.0 YAML schema', async () => {
    const validator = asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/asyncapi/spec/v3.0.0/examples/simple-asyncapi.yml'
    );

    await expect(validator).resolves.toBeInstanceOf(Function);
  });

  it('parse a valid 2.0.0 YAML schema', async () => {
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

  it('throw an error if the YAML schema is not valid', async () => {
    const validator = asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/Elhebert/asyncapi-validation/main/tests/fixtures/invalid-schema-3.0.0.yaml'
    );

    await expect(validator).rejects.toThrow(
      'Your schema and/or referenced documents have governance issues.'
    );
  });

  it('throw an error if the JSON schema is not valid', async () => {
    const validator = asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/Elhebert/asyncapi-validation/main/tests/fixtures/invalid-schema-3.0.0.json'
    );

    await expect(validator).rejects.toThrow(
      'Your schema and/or referenced documents have governance issues.'
    );
  });

  it('throws an error if the URL is not returning an Async API schema', async () => {
    const validator = asyncApiValidation.fromUrl('https://example.org');

    await expect(validator).rejects.toThrow(
      'Your schema is not an AsyncAPI schema.'
    );
  });

  it('validate a valid payload for a YAML 3.0.0 schema', async () => {
    const validator = await asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/asyncapi/spec/v3.0.0/examples/streetlights-kafka-asyncapi.yml'
    );

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('validate a valid payload for a YAML 2.0.0 schema', async () => {
    const validator = await asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/asyncapi/spec/v2.0.0/examples/2.0.0/streetlights.yml'
    );

    const payload = {
      lumens: 500,
      sendAt: '2020-08-06T15:00:00+00:00',
    };

    expect(validator('lightMeasured', payload)).toBe(true);
  });

  it('throw an error if the payload is not valid for a 3.0.0 schema', async () => {
    const validator = await asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/asyncapi/spec/v3.0.0/examples/streetlights-kafka-asyncapi.yml'
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
    const validator = await asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/asyncapi/spec/v2.0.0/examples/2.0.0/streetlights.yml'
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
    const validator = await asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/asyncapi/spec/v3.0.0/examples/streetlights-kafka-asyncapi.yml'
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
    const validator = await asyncApiValidation.fromUrl(
      'https://raw.githubusercontent.com/asyncapi/spec/v2.0.0/examples/2.0.0/streetlights.yml'
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
