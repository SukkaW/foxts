import { describe, it } from 'mocha';
import { expect } from 'expect';
import { mergeHeaders } from '.';

describe('merge-headers', () => {
  it('should work', () => {
    expect(mergeHeaders({ a: '1' }, { b: '2' })).toStrictEqual(new Headers({ a: '1', b: '2' }));
    expect(mergeHeaders({ a: '1' }, { a: '2' })).toStrictEqual(new Headers({ a: '2' }));
    expect(mergeHeaders({ a: '1' }, [['a', '2']])).toStrictEqual(new Headers({ a: '2' }));
  });
});
