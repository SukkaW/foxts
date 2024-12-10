import { describe, it } from 'mocha';
import { expect } from 'expect';
import { headersToObject } from '.';

describe('headers-to-object', () => {
  it('should work', () => {
    expect(headersToObject({ a: '1', b: '2' })).toStrictEqual({ a: '1', b: '2' });
    expect(headersToObject(new Headers({ a: '1', b: '2' }))).toStrictEqual({ a: '1', b: '2' });
  });
});
