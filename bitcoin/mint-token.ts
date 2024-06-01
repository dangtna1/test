import { getUTXOs } from "@/lib/bitcoin/mempool";
import {
  bitcoin,
  getAddressType,
  logToJSON,
  prepareTx,
  toPsbt,
} from "@/lib/bitcoin/bitcoin";
import { RuneId } from "./types/rune_id";
import { RuneStone } from "./types/rune_stone";
import { Edict } from "@/lib/bitcoin/types";
import { Environments } from "@/lib/constants/environment-links";

export async function generateMintTokenPsbtHex({
  pubkey,
  address,
  feeRate,
  etchingBlockHeight,
  etchingTransactionIndex,
  mintAmount,
  environment,
}: {
  pubkey: string;
  address: string;
  feeRate: number;
  etchingBlockHeight: number;
  etchingTransactionIndex: number;
  mintAmount: number;
  environment: Environments;
}) {
  const [addressType, network] = getAddressType(address);
  const output = bitcoin.address.toOutputScript(address, network);
  let utxos = await getUTXOs(environment);
  console.table(utxos);
  // etching block height | etching transaction index
  let runeId = new RuneId(
    BigInt(etchingBlockHeight),
    BigInt(etchingTransactionIndex),
  );
  const runeStone = new RuneStone({
    edicts: [
      new Edict({
        // always 0
        id: runeId,
        // amount to mint
        amount: BigInt(mintAmount),
        // the amount to be minted will be on which output?
        output: BigInt(1),
      }),
    ], // edicts
    cenotaph: false, // is burning? true/false
    mint: runeId,
    pointer: BigInt(1), // default output
  });
  const encipher = runeStone.encipher();
  const outputs = [
    {
      script: encipher,
      value: 0,
    },
    {
      script: output,
      value: 1,
    },
  ];
  let amount = outputs.reduce((a, b) => a + b.value, 0);
  const txResult = prepareTx({
    regularUTXOs: utxos,
    inputs: [],
    outputs,
    feeRate,
    address,
    amount,
  });
  if (txResult.error) {
    throw new Error(txResult.error);
  }
  logToJSON(txResult.ok);
  let pubkeyBuffer = Buffer.from(pubkey, "hex");
  let psbt = toPsbt({ tx: txResult.ok!, pubkey: pubkeyBuffer, rbf: true });
  return psbt.toHex();
}
