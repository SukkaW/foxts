import { randomBytes } from 'node:crypto';
import { base64ToUint8Array, uint8ArrayToString, uint8ArrayToBase64 } from '.';

const oneMb = 1024 * 1024;
const largeBuffer = randomBytes(oneMb);
const largeUint8Array = new Uint8Array(largeBuffer.buffer);
const textFromUint8Array = uint8ArrayToString(largeUint8Array);
const fixtureBase64FromUint8Array = Buffer.from(textFromUint8Array).toString('base64');

(async () => {
  const { bench, group, run } = await import('mitata');

  group('base64ToUint8Array', () => {
    bench('foxts/uint8array', () => {
      base64ToUint8Array(fixtureBase64FromUint8Array);
    });
    bench('Buffer.from(..., "base64")', () => {
      Buffer.from(fixtureBase64FromUint8Array, 'base64');
    });
  });

  group('uint8ArrayToBase64', () => {
    bench('foxts/uint8array', () => {
      uint8ArrayToBase64(largeUint8Array);
    });
    bench('Buffer.from(...).toString("base64")', () => {
      largeBuffer.toString('base64');
    });
  });

  group('uint8ArrayToBase64 -- url safe', () => {
    bench('foxts/uint8array', () => {
      uint8ArrayToBase64(largeUint8Array, true);
    });
    bench('Buffer.from(...).toString("base64")', () => {
      largeBuffer.toString('base64url');
    });
  });

  run();
})();
