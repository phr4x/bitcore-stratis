import { CacheStorage } from '../../models/cache';
import { Config } from '../../services/config';
import { BroadcastTransactionParams, GetEstimateSmartFeeParams } from '../../types/namespaces/ChainStateProvider';
import { InternalStateProvider } from './internal/internal';
import request from 'request';

// Stratis chains prefer to use a REST API and not RPC

export interface StratisBroadcastResponse {
  transactionId: string;
}

export class StratisAPI {
  constructor(private host: string) {}

  sendTransaction(rawTx: string): Promise<StratisBroadcastResponse> {

    return new Promise<StratisBroadcastResponse>((resolve, reject) => {
      let requestOpts = { 
        method: 'POST',
        url: `${this.host}/api/Wallet/send-transaction`,
        body: { hex: rawTx },
        json: true
      };
      request(requestOpts, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.body);
      });
    });    
  }

  getEstimateSmartFee(_: number): Promise<number> {

    // MinTxFee on Strax and Cirrus, units are BTC
    return new Promise<number>((resolve, _) => {
        return resolve(0.0001);
    });
  }
}

export class StratisStateProvider extends InternalStateProvider {
  constructor(chain: string) {
    super(chain);
  }

  getAPI(chain: string, network: string) {
    const API_HOST = Config.get().chains[chain][network].api;
    if (!API_HOST) {
      throw new Error(`API not configured for ${chain} ${network}`);
    }
    const { host } = API_HOST;
    return new StratisAPI(host);
  }

  async getFee(params: GetEstimateSmartFeeParams) {
    const { chain, network, target } = params;
    const cacheKey = `getFee-${chain}-${network}-${target}`;
    return CacheStorage.getGlobalOrRefresh(
      cacheKey,
      async () => {
        let feerate = await this.getAPI(chain, network).getEstimateSmartFee(Number(target));
    
        return {
          feerate,
          blocks: target
        };
      },
      5 * CacheStorage.Times.Minute
    );
  }

  async broadcastTransaction(params: BroadcastTransactionParams) {
    const { chain, network, rawTx } = params;
    const txids = new Array<string>();
    const rawTxs = typeof rawTx === 'string' ? [rawTx] : rawTx;
    for (const tx of rawTxs) {
      const txData = await this.getAPI(chain, network).sendTransaction(tx);
      const txid = txData.transactionId;
      txids.push(txid);
    }
    return txids.length === 1 ? txids[0] : txids;
  }
}
