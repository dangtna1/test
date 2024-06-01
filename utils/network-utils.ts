import { Environments } from "@/lib/constants/environment-links";

export enum NetworkType {
  livenet = "livenet",
  testnet = "testnet",
}

class NetworkUtils {
  private network: NetworkType = NetworkType.testnet;
  setNetworkType(type: NetworkType) {
    this.network = type;
  }
  isTestnet() {
    return this.network === NetworkType.testnet;
  }
}

export const networkUtils = new NetworkUtils();

export function getCurrentNetwork(env: Environments) {
  if (env === Environments.MAINNET) {
    return NetworkType.livenet;
  }

  return NetworkType.testnet;
}
