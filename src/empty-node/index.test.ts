import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { before, describe, after } from 'mocha';
import { tagged as html } from '../tagged';
import { expect } from 'expect';
import { nullthrow } from '../guard';
import { emptyElement, emptyNode } from '.';

describe('empty-node', () => {
  const fixture = html`
    <div id="test-div">
      <p>Paragraph 1</p>
      <p>Paragraph 2</p>
      <p>Paragraph 3</p>
    </div>
  `;

  before(() => {
    GlobalRegistrator.register();
  });

  it('empty-node', () => {
    document.body.innerHTML = fixture;

    const el = nullthrow(document.getElementById('test-div'));

    expect(el.childElementCount).toBe(3);
    emptyNode(el);
    expect(el.childElementCount).toBe(0);
  });

  it('empty-element', () => {
    document.body.innerHTML = fixture;

    const el = nullthrow(document.getElementById('test-div'));

    expect(el.childElementCount).toBe(3);
    emptyElement(el);
    expect(el.childElementCount).toBe(0);
  });

  after(async () => {
    await GlobalRegistrator.unregister();
  });
});
