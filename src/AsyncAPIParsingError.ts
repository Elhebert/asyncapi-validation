import { type Diagnostic } from '@asyncapi/parser';

export default class AsyncAPIParsingError extends Error {
  protected errors?: Diagnostic[];

  constructor(message: string, errors?: Diagnostic[]) {
    super(message, { cause: errors });

    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
