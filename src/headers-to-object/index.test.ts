import { describe, it } from 'mocha';
import { expect } from 'earl';
import { headersToObject } from '.';

describe('headers-to-object', () => {
  it('should work', () => {
    expect(headersToObject({ a: '1', b: '2' })).toEqual({ a: '1', b: '2' });
    expect(headersToObject(new Headers({ a: '1', b: '2' }))).toEqual({ a: '1', b: '2' });
  });
});
