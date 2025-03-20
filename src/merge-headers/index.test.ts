import { describe, it } from 'mocha';
import { expect } from 'expect';
import { mergeHeaders, mergeNodeHttpHeaders } from '.';

describe('merge-headers', () => {
  it('mergeHeaders', () => {
    expect(mergeHeaders({ a: '1' }, { b: '2' })).toStrictEqual(new Headers({ a: '1', b: '2' }));
    expect(mergeHeaders({ a: '1' }, { a: '2' })).toStrictEqual(new Headers({ a: '2' }));
    expect(mergeHeaders({ a: '1' }, [['a', '2']])).toStrictEqual(new Headers({ a: '2' }));
  });

  it('mergeNodeHttpHeaders', () => {
    expect(mergeNodeHttpHeaders({ a: '1' }, { b: '2' })).toStrictEqual({ a: '1', b: '2' });
    expect(mergeNodeHttpHeaders({ a: '1' }, { a: '2' })).toStrictEqual({ a: '2' });
  });

  it('nullish', () => {
    expect(mergeHeaders(null, { a: '1' })).toStrictEqual(new Headers({ a: '1' }));
    expect(mergeHeaders({ a: '1' }, null)).toStrictEqual(new Headers({ a: '1' }));
    expect(mergeHeaders(null, null)).toStrictEqual(new Headers());
  });
});
