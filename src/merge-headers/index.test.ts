import { describe, it } from 'mocha';
import { expect } from 'earl';
import { mergeHeaders, mergeNodeHttpHeaders } from '.';

describe('merge-headers', () => {
  it('mergeHeaders', () => {
    expect(mergeHeaders({ a: '1' }, { b: '2' })).toEqual(new Headers({ a: '1', b: '2' }));
    expect(mergeHeaders({ a: '1' }, { a: '2' })).toEqual(new Headers({ a: '2' }));
    expect(mergeHeaders({ a: '1' }, [['a', '2']])).toEqual(new Headers({ a: '2' }));
  });

  it('mergeNodeHttpHeaders', () => {
    expect(mergeNodeHttpHeaders({ a: '1' }, { b: '2' })).toEqual({ a: '1', b: '2' });
    expect(mergeNodeHttpHeaders({ a: '1' }, { a: '2' })).toEqual({ a: '2' });
  });

  it('nullish', () => {
    expect(mergeHeaders(null, { a: '1' })).toEqual(new Headers({ a: '1' }));
    expect(mergeHeaders({ a: '1' }, null)).toEqual(new Headers({ a: '1' }));
    expect(mergeHeaders(null, null)).toEqual(new Headers());
  });

  it('filter headers', () => {
    expect(mergeHeaders({ a: '1', b: '2' }, { b: '3', c: '4' }, ['b'])).toEqual(new Headers({ a: '1', b: '3' }));
    expect(mergeHeaders({ a: '1', b: '2' }, { b: '3', c: '4' }, (headerName) => headerName === 'b')).toEqual(new Headers({ a: '1', b: '3' }));
  });
});
