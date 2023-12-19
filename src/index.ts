import {
  type ParseOutput,
  Parser,
  fromFile,
  fromURL,
  Input,
} from '@asyncapi/parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import AsyncAPIValidationError from './AsyncAPIValidationError';
import AsyncAPIParsingError from './AsyncAPIParsingError';

export type ValidationFunction = (key: string, payload: unknown) => boolean;

function validate(schema: ParseOutput): ValidationFunction {
  const ajv = new Ajv({ allErrors: true, strict: false, unicodeRegExp: false });
  addFormats(ajv);

  return (key: string, payload: unknown): boolean => {
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
}

const parser = new Parser({ ruleset: { core: true, recommended: false } });

export default {
  async fromFile(path: string): Promise<ValidationFunction> {
    const schema = await fromFile(parser, path, { encoding: 'utf-8' }).parse();

    if (schema.document) {
      return validate(schema);
    }

    throw new AsyncAPIParsingError(
      'Your schema and/or referenced documents have governance issues.',
      schema.diagnostics
    );
  },

  async fromUrl(url: string): Promise<ValidationFunction> {
    const schema = await fromURL(parser, url).parse();

    if (schema.document) {
      return validate(schema);
    }

    throw new AsyncAPIParsingError(
      'Your schema and/or referenced documents have governance issues.',
      schema.diagnostics
    );
  },

  async fromSchema(schema: Input): Promise<ValidationFunction> {
    const parsedSchema = await parser.parse(schema);
    if (parsedSchema.document) {
      return validate(parsedSchema);
    }

    throw new AsyncAPIParsingError(
      'Your schema and/or referenced documents have governance issues.',
      parsedSchema.diagnostics
    );
  },
};
