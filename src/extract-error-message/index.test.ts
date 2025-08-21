import { describe, it } from 'mocha';
import { expect } from 'expect';
import { extractErrorMessage } from '.';

describe('extractErrorMessage', () => {
  it('should extract message from real Error', () => {
    const error = new Error('Something went wrong');
    expect(extractErrorMessage(error)).toBe('Error: Something went wrong');
    expect(extractErrorMessage(error, false)).toBe('Something went wrong');

    expect(extractErrorMessage(error, true, true)).toBe('Error: Something went wrong\n' + error.stack);
  });

  it('should extract message from ErrorLikeObject', () => {
    const error = { name: 'Error', message: 'Something went wrong' };
    expect(extractErrorMessage(error)).toBe('Error: Something went wrong');
    expect(extractErrorMessage(error, false)).toBe('Something went wrong');
  });

  it('should return null for non-ErrorLikeObject', () => {
    expect(extractErrorMessage(114514)).toBe(null);
    expect(extractErrorMessage(null)).toBe(null);
    expect(extractErrorMessage(undefined)).toBe(null);
    expect(extractErrorMessage({})).toBe(null);
    expect(extractErrorMessage({ message: 123 })).toBe(null);
    expect(extractErrorMessage({ name: 123 })).toBe(null);
  });
});
