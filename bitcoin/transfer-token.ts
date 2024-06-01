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

export async function generateTransferTokenPsbtHex({
  pubkey,
  address,
  receiveAddress,
  feeRate,
  etchingBlockHeight,
  etchingTransactionIndex,
  transferAmount,
  vout,
  txid,
  availableAmount,
  environment,
}: {
  pubkey: string;
  address: string;
  receiveAddress: string;
  feeRate: number;
  etchingBlockHeight: number;
  etchingTransactionIndex: number;
  transferAmount: number;
  vout: number;
  txid: string;
  availableAmount: number;
  environment: Environments;
}) {
  const [_addressType, network] = getAddressType(address);
  const output = bitcoin.address.toOutputScript(address, network);
  const outputReceiver = bitcoin.address.toOutputScript(
    receiveAddress,
    network,
  );
  let utxos = await getUTXOs(environment);
  console.table(utxos);
  // balance location: txid:vout
  const location = `${txid}:${vout}`;
  let input = utxos.find((e) => e.txid + ":" + e.vout === location)!;
  // etching block height | etching transaction index
  let runeId = new RuneId(
    BigInt(etchingBlockHeight),
    BigInt(etchingTransactionIndex),
  );

  const runeStone = new RuneStone({
    edicts: [
      new Edict({
        id: runeId,
        amount: BigInt(transferAmount),
        output: BigInt(1),
      }),
      new Edict({
        id: runeId,
        amount: BigInt(availableAmount - transferAmount),
        output: BigInt(2),
      }),
    ],
    cenotaph: false,
  });

  const encipher = runeStone.encipher();
  const outputs = [
    {
      script: encipher,
      value: 0,
    },
    {
      script: outputReceiver,
      value: 1,
    },
    {
      script: output,
      value: input.value,
    },
  ];
  let amount = outputs.reduce((a, b) => a + b.value, 0) - input.value;
  const txResult = prepareTx({
    regularUTXOs: utxos,
    inputs: [input],
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
