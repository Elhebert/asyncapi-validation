import asyncApiValidation, { type ValidationFunction } from '../src/index';

describe('AsyncAPI validation', () => {
  describe('fromUrl', () => {
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

    it('throws an error if the schema is broken', async () => {
      const validator = asyncApiValidation.fromUrl(
        'https://raw.githubusercontent.com/WaleedAshraf/asyncapi-validator/master/test/schemas/broken.yml'
      );

      await expect(validator).rejects.toThrow(
        'Your schema and/or referenced documents have governance issues.'
      );
    });

    it('parse a yaml schema', async () => {
      const validator = asyncApiValidation.fromUrl(
        'https://raw.githubusercontent.com/WaleedAshraf/asyncapi-validator/master/test/schemas/v2.0.0/mqtt.yaml'
      );

      await expect(validator).resolves.toBeInstanceOf(Function);
    });

    it('parse a json schema', async () => {
      const validator = asyncApiValidation.fromUrl(
        'https://raw.githubusercontent.com/WaleedAshraf/asyncapi-validator/master/test/schemas/jsonSchema.json'
      );

      await expect(validator).resolves.toBeInstanceOf(Function);
    });
  });

  describe('2.4.0', () => {
    let validator: ValidationFunction;

    beforeAll(async () => {
      validator = await asyncApiValidation.fromUrl(
        'https://raw.githubusercontent.com/WaleedAshraf/asyncapi-validator/master/test/schemas/v2.4.0/mqtt.yaml'
      );
    });

    it('should validate alerts message', () => {
      const validate = validator('devices/alerts', [
        {
          message: 'temperature too high',
          name: 'temperature_high',
          state: 'set',
          timestamp: 0,
        },
      ]);
      expect(validate).toStrictEqual(true);
    });

    it('should validate command_responses message', () => {
      const validate = validator('devices/command_responses', [
        {
          id: '7f5bc456-21f2-4e9e-a38f-80baf762b1c5',
          message: 'message describing the command progress',
          status: 'in_progress',
          timestamp: 0,
        },
      ]);
      expect(validate).toStrictEqual(true);
    });

    it('should validate commands message', () => {
      const validate = validator('devices/commands', {
        deviceId: 'd44d8a14-5fbb-4e4a-96a6-ed0c71c11fa8',
        id: '7f5bc456-21f2-4e9e-a38f-80baf762b1c5',
        name: 'dim_light',
        parameter: true,
        timestamp: 0,
      });
      expect(validate).toStrictEqual(true);
    });

    it('should validate config_requests message', () => {
      const validate = validator('devices/config_requests', [
        {
          timestamp: 0,
        },
      ]);
      expect(validate).toStrictEqual(true);
    });

    it('should validate configs message', () => {
      const validate = validator('devices/configs', {
        configuration: {
          maximum_temperature: 60,
        },
        deviceId: 'd44d8a14-5fbb-4e4a-96a6-ed0c71c11fa8',
        version: 2,
      });
      expect(validate).toStrictEqual(true);
    });

    it('should validate errors message', () => {
      const validate = validator('devices/errors', {
        error: "command field 'id' is NOT an UUID",
        messageId: 31248,
        payload: "{'id':'not UUID','status':'in_progress'}",
        topic: 'devices/763c073a-e0ff-41a9-bd51-3386975ea4e3/commands',
      });
      expect(validate).toStrictEqual(true);
    });

    it('should validate installations message', () => {
      const validate = validator('devices/installations', {
        buildStamp: 'string',
        description: 'package.gwa-core-v1.1',
        deviceId: 'd44d8a14-5fbb-4e4a-96a6-ed0c71c11fa8',
        fileName: 'gwa-core.tgz',
        id: '763c073a-e0ff-41a9-bd51-3386975ea4e3',
        location: 'http://foo.bar/buzz.xyz',
        signature: '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12',
        signatureType: 'sha-256',
        size: 1048576,
        timestamp: 0,
        type: 'gwa-core-package',
      });
      expect(validate).toStrictEqual(true);
    });

    it('should validate measurements message', () => {
      const validate = validator('devices/measurements', [
        {
          name: 'temperature',
          timestamp: 0,
          value: 36.6,
        },
      ]);
      expect(validate).toStrictEqual(true);
    });
  });

  describe('2.0.0', () => {
    let validator: ValidationFunction;

    beforeAll(async () => {
      validator = await asyncApiValidation.fromUrl(
        'https://raw.githubusercontent.com/WaleedAshraf/asyncapi-validator/master/test/schemas/v2.0.0/mqtt.yaml'
      );
    });

    it('should validate alerts message', () => {
      const validate = validator('devices/alerts', [
        {
          message: 'temperature too high',
          name: 'temperature_high',
          state: 'set',
          timestamp: 0,
        },
      ]);
      expect(validate).toStrictEqual(true);
    });

    it('should validate command_responses message', () => {
      const validate = validator('devices/command_responses', [
        {
          id: '7f5bc456-21f2-4e9e-a38f-80baf762b1c5',
          message: 'message describing the command progress',
          status: 'in_progress',
          timestamp: 0,
        },
      ]);
      expect(validate).toStrictEqual(true);
    });

    it('should validate commands message', () => {
      const validate = validator('devices/commands', {
        deviceId: 'd44d8a14-5fbb-4e4a-96a6-ed0c71c11fa8',
        id: '7f5bc456-21f2-4e9e-a38f-80baf762b1c5',
        name: 'dim_light',
        parameter: true,
        timestamp: 0,
      });
      expect(validate).toStrictEqual(true);
    });

    it('should validate config_requests message', () => {
      const validate = validator('devices/config_requests', [
        {
          timestamp: 0,
        },
      ]);
      expect(validate).toStrictEqual(true);
    });

    it('should validate configs message', () => {
      const validate = validator('devices/configs', {
        configuration: {
          maximum_temperature: 60,
        },
        deviceId: 'd44d8a14-5fbb-4e4a-96a6-ed0c71c11fa8',
        version: 2,
      });
      expect(validate).toStrictEqual(true);
    });

    it('should validate errors message', () => {
      const validate = validator('devices/errors', {
        error: "command field 'id' is NOT an UUID",
        messageId: 31248,
        payload: "{'id':'not UUID','status':'in_progress'}",
        topic: 'devices/763c073a-e0ff-41a9-bd51-3386975ea4e3/commands',
      });
      expect(validate).toStrictEqual(true);
    });

    it('should validate installations message', () => {
      const validate = validator('devices/installations', {
        buildStamp: 'string',
        description: 'package.gwa-core-v1.1',
        deviceId: 'd44d8a14-5fbb-4e4a-96a6-ed0c71c11fa8',
        fileName: 'gwa-core.tgz',
        id: '763c073a-e0ff-41a9-bd51-3386975ea4e3',
        location: 'http://foo.bar/buzz.xyz',
        signature: '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12',
        signatureType: 'sha-256',
        size: 1048576,
        timestamp: 0,
        type: 'gwa-core-package',
      });
      expect(validate).toStrictEqual(true);
    });

    it('should validate measurements message', () => {
      const validate = validator('devices/measurements', [
        {
          name: 'temperature',
          timestamp: 0,
          value: 36.6,
        },
      ]);
      expect(validate).toStrictEqual(true);
    });
  });
});
