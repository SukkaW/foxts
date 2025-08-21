export interface ErrorLikeObject {
  name: string,
  message: string,
  stack?: string
}

export function isErrorLikeObject(obj: unknown): obj is ErrorLikeObject {
  if (
    typeof obj !== 'object'
    || obj === null
  ) {
    return false;
  }

  if (
    'name' in obj && typeof obj.name === 'string'
    && 'message' in obj && typeof obj.message === 'string'
  ) {
    if ('stack' in obj) {
      return typeof obj.stack === 'string';
    }
    return true;
  }

  return false;
}

export function extractErrorMessage(error: unknown, includeName = true, includeStack = false): string | null {
  if (!isErrorLikeObject(error)) {
    return null;
  }

  let message = '';
  if (includeName) {
    message += error.name;
    message += ': ';
  }

  message += error.message;

  if (includeStack && 'stack' in error && typeof error.stack === 'string') {
    message += '\n' + error.stack;
  }

  // Trim any extra whitespace
  return message.trim();
}
