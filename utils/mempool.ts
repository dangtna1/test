export enum MempoolType {
  Tx = "tx",
  Block = "block",
  Address = "address",
}
export function getTxAddressLink(
  txid: string,
  type = MempoolType.Tx,
  environment = "mainnet",
) {
  if (environment === "mainnet") {
    return `https://mempool.space/${type}/${txid}`;
  }

  return `https://mempool.space/${environment}/${type}/${txid}`;
}
