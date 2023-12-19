import { type ParseOutput } from '@asyncapi/parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import AsyncAPIValidationError from './AsyncAPIValidationError';

export type ValidationFunction = (key: string, payload: unknown) => boolean;

/**
 * Validates the provided AsyncAPI schema and returns a validation function.
 *
 * @param {ParseOutput} schema - The parsed AsyncAPI schema.
 *
 * @returns {ValidationFunction} The validation function.
 */
export default function validate(schema: ParseOutput): ValidationFunction {
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
