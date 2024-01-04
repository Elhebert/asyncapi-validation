import { type ErrorObject } from 'ajv';

/**
 * Represents an error that occurs during AsyncAPI validation.
 * @class
 */
export default class AsyncAPIValidationError extends Error {
  protected key: string;

  protected errors?: ErrorObject[] | null;

  /**
   * Represents an error that occurs during AsyncAPI validation.
   *
   * @param {string} message - The error message.
   * @param {string} key - The key associated with the error.
   * @param {ErrorObject[]|null} [errors] - The array of validation error objects.
   */
  constructor(message: string, key: string, errors?: ErrorObject[] | null) {
    super(message);

    this.key = key;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
