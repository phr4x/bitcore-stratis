import { BchDeriver } from './bch';
import { BtcDeriver } from './btc';
import { CirrusDeriver } from './crs';
import { DogeDeriver } from './doge';
import { EthDeriver } from './eth';
import { LtcDeriver } from './ltc';
import { Paths } from './paths';
import { StraxDeriver } from './strax';
import { XrpDeriver } from './xrp';

export interface Key {
  address: string;
  privKey?: string;
  pubKey?: string;
}

export interface IDeriver {
  deriveAddress(network: string, xPub: string, addressIndex: number, isChange: boolean): string;

  derivePrivateKey(network: string, xPriv: string, addressIndex: number, isChange: boolean): Key;
}

const derivers: { [chain: string]: IDeriver } = {
  BTC: new BtcDeriver(),
  BCH: new BchDeriver(),
  ETH: new EthDeriver(),
  XRP: new XrpDeriver(),
  DOGE: new DogeDeriver(),
  LTC: new LtcDeriver(),
  STRAX: new StraxDeriver(),
  CRS: new CirrusDeriver()
};

export class DeriverProxy {
  get(chain) {
    return derivers[chain];
  }

  deriveAddress(chain, network, xpubKey, addressIndex, isChange) {
    return this.get(chain).deriveAddress(network, xpubKey, addressIndex, isChange);
  }

  derivePrivateKey(chain, network, privKey, addressIndex, isChange) {
    return this.get(chain).derivePrivateKey(network, privKey, addressIndex, isChange);
  }

  pathFor(chain, network, account = 0) {
    const normalizedChain = chain.toUpperCase();
    const accountStr = `${account}'`;
    const chainConfig = Paths[normalizedChain];
    if (chainConfig && chainConfig[network]) {
      return chainConfig[network] + accountStr;
    } else {
      return Paths.default.testnet + accountStr;
    }
  }
}

export default new DeriverProxy();
