import {
  type Input,
  type ParseOutput,
  fromFile,
  fromURL,
  Parser,
} from '@asyncapi/parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import AsyncAPIValidationError from './AsyncAPIValidationError';
import AsyncAPIParsingError from './AsyncAPIParsingError';

export type ValidationFunction = (key: string, payload: unknown) => boolean;

/**
 * Validates the provided AsyncAPI schema and returns a validation function.
 *
 * @param {ParseOutput} schema - The parsed AsyncAPI schema.
 *
 * @returns {ValidationFunction} The validation function.
 */
function validate(schema: ParseOutput): ValidationFunction {
  const ajv = new Ajv({ allErrors: true, strict: false, unicodeRegExp: false });
  addFormats(ajv);

  /**
   * Validates the provided payload against the AsyncAPI schema.
   *
   * @param {string} key - The key of the message to validate.
   * @param {unknown} payload - The payload to validate.
   * @returns {boolean} true if the payload is valid.
   *
   * @throws {Error} if no messages are found for the given key.
   * @throws {AsyncAPIValidationError} if the payload fails validation.
   */
  const validatorFunction = (key: string, payload: unknown): boolean => {
    const message = schema.document
      ?.components()
      .messages()
      .find((m) => {
        return m.id() === key || m.name() === key;
      });

    if (!message) {
      throw new Error('No messages found for the given key');
    }

    const validator = ajv.compile(message.payload()?.json() || {});
    const validationResult = validator(payload);

    if (!validationResult) {
      throw new AsyncAPIValidationError(
        ajv.errorsText(validator.errors),
        key,
        validator.errors
      );
    }

    return true;
  };

  return validatorFunction;
}

const parser = new Parser({ ruleset: { core: true, recommended: false } });

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

    if (schema.diagnostics[0].code === 'uncaught exception') {
      throw new AsyncAPIParsingError(
        'Your schema is not valid.',
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

    if (schema.diagnostics[0].code === 'uncaught exception') {
      throw new AsyncAPIParsingError(
        'Your schema is not valid.',
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

    if (parsedSchema.diagnostics[0].code === 'uncaught exception') {
      throw new AsyncAPIParsingError(
        'Your schema is not valid.',
        parsedSchema.diagnostics
      );
    }

    throw new AsyncAPIParsingError(
      'Your schema and/or referenced documents have governance issues.',
      parsedSchema.diagnostics
    );
  },
};
