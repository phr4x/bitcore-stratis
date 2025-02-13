'use strict';
import * as CWC from 'crypto-wallet-core';

export const Constants = {
  SCRIPT_TYPES: {
    P2SH: 'P2SH',
    P2PKH: 'P2PKH',
    P2WPKH: 'P2WPKH',
    P2WSH: 'P2WSH'
  },
  // not used, since Credentials 2.0
  DERIVATION_STRATEGIES: {
    BIP44: 'BIP44',
    BIP45: 'BIP45',
    BIP48: 'BIP48'
  },
  PATHS: {
    SINGLE_ADDRESS: 'm/0/0',
    REQUEST_KEY: "m/1'/0",
    //  TXPROPOSAL_KEY: "m/1'/1",
    REQUEST_KEY_AUTH: 'm/2' // relative to BASE
  },
  BIP45_SHARED_INDEX: 0x80000000 - 1,
  COINS: [
    'btc',
    'bch',
    'eth',
    'xrp',
    'doge',
    'ltc',
    'usdc',
    'pax',
    'gusd',
    'busd',
    'dai',
    'wbtc',
    'strax',
    'crs'
  ],
  ERC20: ['usdc', 'pax', 'gusd', 'busd', 'dai', 'wbtc'],
  UTXO_COINS: ['btc', 'bch', 'doge', 'ltc', 'strax', 'crs'],
  TOKEN_OPTS: CWC.Constants.TOKEN_OPTS,
  UNITS: CWC.Constants.UNITS
};
