// base-x encoding / decoding | MIT | https://github.com/cryptocoinjs/base-x
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
//
// Copyright (c) 2026 SukkaW (https://skk.moe)
//
// Simplified by SukkSW to only support base92 encoding/decoding

const ALPHABET = [
  // ! # $ % & ' ( ) * +
  33, 35, 36, 37, 38, 39, 40, 41, 42, 43,
  // , - . / 0 1 2 3 4 5
  44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
  // 6 7 8 9 : ; < = > ?
  54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
  // @ A B C D E F G H I
  64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
  // J K L M N O P Q R S
  74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
  // T U V W X Y Z [ \ ]
  84, 85, 86, 87, 88, 89, 90, 91, 92, 93,
  // ^ _ a b c d e f g h
  94, 95, 97, 98, 99, 100, 101, 102, 103, 104,
  // i j k l m n o p q r
  105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
  // s t u v w x y z { |
  115, 116, 117, 118, 119, 120, 121, 122, 123, 124,
  // } ~
  125, 126
];

const BASE_MAP = new Uint8Array(256);
for (let j = 0; j < BASE_MAP.length; j++) {
  BASE_MAP[j] = 255;
}

const BASE = 92;

for (let i = 0; i < BASE; i++) {
  const xc = ALPHABET[i];
  BASE_MAP[xc] = i;
}

const LEADER = String.fromCharCode(ALPHABET[0]);
const FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
const iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up

export function uint8ArrayToBase92(source: Uint8Array): string {
  if (source.length === 0) return '';

  // Skip & count leading zeroes.
  let zeroes = 0;
  let length = 0;
  let pbegin = 0;
  const pend = source.length;

  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++;
    zeroes++;
  }

  // Allocate enough space in big-endian base58 representation.
  const size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
  const b58 = new Uint8Array(size);

  // Process the bytes.
  while (pbegin !== pend) {
    let carry = source[pbegin];

    // Apply "b58 = b58 * 256 + ch".
    let i = 0;
    for (let it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
      carry += (256 * b58[it1]) >>> 0;
      b58[it1] = (carry % BASE) >>> 0;
      carry = (carry / BASE) >>> 0;
    }

    if (carry !== 0) throw new Error('Non-zero carry');
    length = i;
    pbegin++;
  }

  // Skip leading zeroes in base58 result.
  let it2 = size - length;
  while (it2 !== size && b58[it2] === 0) {
    it2++;
  }

  // Translate the result into a string.
  let str = LEADER.repeat(zeroes);
  for (; it2 < size; ++it2) str += String.fromCharCode(ALPHABET[b58[it2]]);

  return str;
}

export function base92ToUint8Array(source: string): Uint8Array {
  if (source.length === 0) return new Uint8Array(0);

  let psz = 0;

  // Skip and count leading '1's.
  let zeroes = 0;
  let length = 0;
  while (source[psz] === LEADER) {
    zeroes++;
    psz++;
  }

  // Allocate enough space in big-endian base256 representation.
  const size = (((source.length - psz) * FACTOR) + 1) >>> 0; // log(58) / log(256), rounded up.
  const b256 = new Uint8Array(size);

  // Process the characters.
  while (psz < source.length) {
    // Find code of next character
    const charCode = source.charCodeAt(psz);

    // Decode character
    let carry = BASE_MAP[charCode];

    let i = 0;
    for (let it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
      carry += (BASE * b256[it3]) >>> 0;
      b256[it3] = (carry % 256) >>> 0;
      carry = (carry / 256) >>> 0;
    }

    if (carry !== 0) throw new Error('Non-zero carry');
    length = i;
    psz++;
  }

  // Skip leading zeroes in b256.
  let it4 = size - length;
  while (it4 !== size && b256[it4] === 0) {
    it4++;
  }

  const vch = new Uint8Array(zeroes + (size - it4));

  let j = zeroes;
  while (it4 !== size) {
    vch[j++] = b256[it4++];
  }

  return vch;
}
