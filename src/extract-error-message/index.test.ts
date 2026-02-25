import { describe, it } from 'mocha';
import { expect } from 'earl';
import { extractErrorMessage } from '.';

describe('extractErrorMessage', () => {
  it('should extract message from real Error', () => {
    const error = new Error('Something went wrong');
    expect(extractErrorMessage(error)).toEqual('Error: Something went wrong');
    expect(extractErrorMessage(error, false)).toEqual('Something went wrong');

    expect(extractErrorMessage(error, true, true)).toEqual('Error: Something went wrong\n' + error.stack);
  });

  it('should extract message from ErrorLikeObject', () => {
    const error = { name: 'Error', message: 'Something went wrong' };
    expect(extractErrorMessage(error)).toEqual('Error: Something went wrong');
    expect(extractErrorMessage(error, false)).toEqual('Something went wrong');
  });

  it('should return null for non-ErrorLikeObject', () => {
    expect(extractErrorMessage(114514)).toEqual(null);
    expect(extractErrorMessage(null)).toEqual(null);
    expect(extractErrorMessage(undefined)).toEqual(null);
    expect(extractErrorMessage({})).toEqual(null);
    expect(extractErrorMessage({ message: 123 })).toEqual(null);
    expect(extractErrorMessage({ name: 123 })).toEqual(null);
  });
});
