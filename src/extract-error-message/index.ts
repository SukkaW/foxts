export interface ErrorLikeObject {
  name: string,
  message: string,
  stack?: string
}

const NAME = 'name' as const;
const MESSAGE = 'message' as const;
const STACK = 'stack' as const;

export function isErrorLikeObject(obj: unknown): obj is ErrorLikeObject {
  if (
    typeof obj !== 'object'
    || !obj
  ) {
    return false;
  }

  if (
    NAME in obj && typeof obj[NAME] === 'string'
    && MESSAGE in obj && typeof obj[MESSAGE] === 'string'
  ) {
    if (STACK in obj) {
      return typeof obj[STACK] === 'string';
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
    message += error[NAME];
    message += ': ';
  }

  message += error[MESSAGE];

  if (includeStack && STACK in error && typeof error[STACK] === 'string') {
    message += '\n' + error[STACK];
  }

  // Trim any extra whitespace
  return message.trim();
}
