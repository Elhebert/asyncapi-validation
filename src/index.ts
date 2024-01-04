import { type Input, fromFile, fromURL, Parser } from '@asyncapi/parser';
import AsyncAPIParsingError from './AsyncAPIParsingError';
import validate, { type ValidationFunction } from './validate';
import openAPISchemaParser from '@asyncapi/openapi-schema-parser';

const parser = new Parser({
  ruleset: { core: true, recommended: false },
  schemaParsers: [openAPISchemaParser()],
});

export default {
  /**
   * Parses an AsyncAPI schema from a file and returns a validation function.
   *
   * @param {string} path - The path to the AsyncAPI schema file.
   * @returns {Promise<ValidationFunction>} A promise that resolves to the validation function.
   *
   * @throws {AsyncAPIParsingError} if the schema is not valid or has governance issues.
   *
   * @example
   * const validator = await asyncApiValidation.fromFile('path/to/schema.yaml');
   * validator('messageKey', { foo: 'bar' });
   */
  async fromFile(path: string): Promise<ValidationFunction> {
    const schema = await fromFile(parser, path, { encoding: 'utf-8' }).parse();

    if (schema.document) {
      return validate(schema);
    }

    if (schema.diagnostics[0].code === 'uncaught-error') {
      throw new AsyncAPIParsingError(
        'Your schema is not an AsyncAPI schema.',
        schema.diagnostics
      );
    }

    throw new AsyncAPIParsingError(
      'Your schema and/or referenced documents have governance issues.',
      schema.diagnostics
    );
  },

  /**
   * Parses an AsyncAPI schema from a URL and returns a validation function.
   *
   * @param {string} url - The URL of the AsyncAPI schema.
   * @returns {Promise<ValidationFunction>} A promise that resolves to the validation function.
   *
   * @throws {AsyncAPIParsingError} if the schema is not valid or has governance issues.
   *
   * @example
   * const validator = await asyncApiValidation.fromUrl('https://example.org/schema.yaml');
   * validator('messageKey', { foo: 'bar' });
   */
  async fromUrl(url: string): Promise<ValidationFunction> {
    const schema = await fromURL(parser, url).parse();

    if (schema.document) {
      return validate(schema);
    }

    if (schema.diagnostics[0].code === 'uncaught-error') {
      throw new AsyncAPIParsingError(
        'Your schema is not an AsyncAPI schema.',
        schema.diagnostics
      );
    }

    throw new AsyncAPIParsingError(
      'Your schema and/or referenced documents have governance issues.',
      schema.diagnostics
    );
  },

  /**
   * Parses an AsyncAPI schema from a string and returns a validation function.
   *
   * @param {string} schema - The AsyncAPI schema as a string.
   * @returns {Promise<ValidationFunction>} A promise that resolves to the validation function.
   *
   * @throws {AsyncAPIParsingError} if the schema is not valid or has governance issues.
   *
   * @example
   * const validator = await asyncApiValidation.fromString('asyncapi: 2.0.0');
   * validator('messageKey', { foo: 'bar' });
   */
  async fromSchema(schema: Input): Promise<ValidationFunction> {
    const parsedSchema = await parser.parse(schema);

    if (parsedSchema.document) {
      return validate(parsedSchema);
    }

    if (parsedSchema.diagnostics[0].code === 'uncaught-error') {
      throw new AsyncAPIParsingError(
        'Your schema is not an AsyncAPI schema.',
        parsedSchema.diagnostics
      );
    }

    throw new AsyncAPIParsingError(
      'Your schema and/or referenced documents have governance issues.',
      parsedSchema.diagnostics
    );
  },
};
