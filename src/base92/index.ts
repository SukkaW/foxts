// base-x encoding / decoding | MIT | https://github.com/cryptocoinjs/base-x
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
//
// Copyright (c) 2026 SukkaW (https://skk.moe)
//
// Simplified by SukkSW to only support base92 encoding/decoding

import { base } from '../base';

export const { encode: uint8ArrayToBase92, decode: base92ToUint8Array } = base(String.raw`!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_abcdefghijklmnopqrstuvwxyz{|}~`);
