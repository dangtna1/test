import { Network } from "bitcoinjs-lib";
import { bitcoin } from "./bitcoin";
import { getMyUtxosBackend } from "@/lib/rune";
import { Environments } from "@/lib/constants/environment-links";
import { getBaseUrlByEnv } from "@/lib/rune/endpoint";

function isTestnet(network: Network) {
  return network === bitcoin.networks.testnet;
}

function getNetwork(network: Network) {
  return isTestnet(network) ? "testnet" : "livenet";
}

export function getNetworkObject(network: string) {
  switch (network) {
    case "testnet":
      return bitcoin.networks.testnet;
    default:
      return bitcoin.networks.bitcoin;
  }
}

export interface UTXO {
  txid: string;
  vout: number;
  value: number;
}

export async function getUTXOs(environment: Environments) {
  const { ok, body } = await getMyUtxosBackend(environment);
  if (!ok) {
    console.error(body);
    throw new Error("Failed to fetch UTXOs");
  }
  const data = body.data;

  return data
    .map((e) => {
      delete (e as any).status;
      return e;
    })
    .sort((a, b) => b.value - a.value);
}

export function broadcastRequest(rawhex: string, network: Environments) {
  return fetch(`${getBaseUrlByEnv(network)}/transactions/broadcast`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      rawTransaction: rawhex,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.data?.error?.message) {
        return {
          message: data.data.error.message,
        };
      }
      return {
        txid: data.data.result,
      };
    });
}

export function getOutputValue(network: Network) {
  return isTestnet(network) ? 1 : 546;
}
