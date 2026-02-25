import { describe, it } from 'mocha';
import { expect } from 'earl';
import { stringJoin } from '.';

describe('string-join', () => {
  it('should work', () => {
    expect(stringJoin([])).toEqual('');
    expect(stringJoin([null, '1'], ' ')).toEqual('1');
    expect(stringJoin([undefined, '2', '3'], ' ')).toEqual('2 3');
    expect(stringJoin(['1', '2'])).toEqual('1,2');
    expect(stringJoin(['1', '2', undefined, undefined])).toEqual('1,2');
  });

  it('dedupe', () => {
    expect(stringJoin([], ' ', true)).toEqual('');
    expect(stringJoin(new Array(2), ' ', true)).toEqual('');
    expect(stringJoin(['1', '1', '2'], ' ', true)).toEqual('1 2');
  });
});
