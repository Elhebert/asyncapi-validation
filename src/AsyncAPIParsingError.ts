import { type Diagnostic } from '@asyncapi/parser';

/**
 * Represents an error that occurs during the parsing of an AsyncAPI document.
 * @class
 */
export default class AsyncAPIParsingError extends Error {
  protected errors?: Diagnostic[];

  /**
   * Represents an error that occurs during the parsing of an AsyncAPI document.
   *
   * @param {string} message - The error message.
   * @param {Diagnostic[]} [errors] - Optional array of diagnostic errors associated with the parsing error.
   */
  constructor(message: string, errors?: Diagnostic[]) {
    super(message, { cause: errors });

    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
