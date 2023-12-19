import { type ErrorObject } from 'ajv';

export default class AsyncAPIValidationError extends Error {
  protected key: string;
  protected errors?: ErrorObject[] | null;

  constructor(message: string, key: string, errors?: ErrorObject[] | null) {
    super(message);

    this.key = key;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
