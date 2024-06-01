import {
  addressToOutputScript,
  bitcoin,
  getAddressType,
  getKeypairInfo,
  prepareCommitAndRevealTx,
  PrepareCommitAndRevealTxResult,
  prepareCommitRevealConfig,
  randomP2TRWallet,
  toPsbt,
} from "./bitcoin";
import { broadcastRequest, getOutputValue, getUTXOs } from "./mempool";
import { Etching, RuneId, RuneStone } from "./types";
import { SpacedRune } from "@/lib/bitcoin/types/spaced_rune";
import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";
import { Terms } from "@/lib/bitcoin/types/terms";
import { Psbt } from "bitcoinjs-lib";
import { ECPairInterface } from "ecpair";
import {
  Environments,
  getEnvironmentByNetwork,
} from "@/lib/constants/environment-links";
import { NetworkType } from "@/lib/utils/network-utils";

export interface CommitPsbt {
  psbtHex: string | undefined;
  hashLockP2TR: bitcoin.payments.Payment;
  revealOutputs: { script: Buffer; value: number }[];
  txResult: PrepareCommitAndRevealTxResult;
  revealWalletKeypair: ECPairInterface;
}

export async function generateIssueFairMintTokenPsbtHex({
  pubkey,
  address,
  feeRate,
  ticker,
  symbol,
  decimals,
  amount,
  cap,
  heightStart,
  heightEnd,
  offsetStart,
  offsetEnd,
  premine,
  environment,
}: {
  pubkey: string;
  address: string;
  feeRate: number;
  ticker: string;
  symbol?: string;
  decimals: number;
  amount: number;
  heightStart?: number;
  heightEnd?: number;
  offsetStart?: number;
  offsetEnd?: number;
  cap: number;
  premine: number;
  environment: Environments;
}): Promise<CommitPsbt> {
  const [_addressType, network] = getAddressType(address);
  const output = bitcoin.address.toOutputScript(address, network);
  let utxos = await getUTXOs(environment);

  // the name of the token
  let spRune = SpacedRune.fromString(ticker);

  const height =
    heightStart || heightEnd
      ? [
          heightStart ? BigInt(heightStart) : null,
          heightEnd ? BigInt(heightEnd) : null,
        ]
      : null;

  const offset =
    offsetStart || offsetEnd
      ? [
          offsetStart ? BigInt(offsetStart) : null,
          offsetEnd ? BigInt(offsetEnd) : null,
        ]
      : null;

  const runeStone = new RuneStone({
    edicts: [], // edicts
    etching: new Etching({
      spacers: (spRune as SpacedRune).spacers,
      divisibility: decimals,
      // the name of the token, if null, it will be automatically generated.
      rune: (spRune as SpacedRune).rune,
      // this is not the name of the token, only one character is supported here
      symbol,
      // premine
      premine: BigInt(premine),
      terms: new Terms({
        // cap = supply / ( 10^divisibility )
        cap: BigInt(cap),
        amount: BigInt(amount),
        height,
        offset,
      }),
    }), // etching
    mint: null, // claim
    // receiver output index
    pointer: BigInt(1), // default output
  });
  // runeStone.setTag(RUNE_STONE_TAG);
  const encipher = runeStone.encipher();
  const revealOutputs = [
    {
      script: encipher,
      value: 0,
    },
    {
      script: output,
      value: getOutputValue(network),
    },
  ];

  let pubkeyBuffer = Buffer.from(pubkey, "hex");

  // compose tapscript
  let revealWallet = randomP2TRWallet(network);
  const tapInternalKey = toXOnly(revealWallet.pubkey);

  let payload = Buffer.from(runeStone.etching?.rune?.commitment()!);

  const { scriptP2TR, hashLockP2TR } = prepareCommitRevealConfig(
    tapInternalKey,
    payload,
    network,
  );

  let txResult = prepareCommitAndRevealTx({
    // safe btc utxos
    utxos,
    feeRate,
    network,
    // reveal input number, default is 1
    revealInputs: 1,
    // reveal outputs
    revealOutputs,
    payload,
  });

  console.table(txResult);

  const commitOutputs = [
    {
      address: scriptP2TR.address!,
      value: txResult.revealNeed,
    },
  ];

  if (txResult.change) {
    commitOutputs.push({
      address,
      value: txResult.change,
    });
  }

  let commitPsbt = toPsbt({
    tx: {
      inputs: txResult.inputs,
      outputs: commitOutputs,
      feeRate,
      address,
    },
    pubkey: pubkeyBuffer,
    rbf: true,
  });
  return {
    psbtHex: commitPsbt.toHex(),
    revealOutputs,
    txResult,
    hashLockP2TR,
    revealWalletKeypair: revealWallet.keyPair,
  };
}

export async function generateIssueFixedCapTokenPsbtHex({
  pubkey,
  address,
  feeRate,
  ticker,
  symbol,
  decimals,
  receivers,
  supply,
  environment,
}: {
  pubkey: string;
  address: string;
  feeRate: number;
  ticker: string;
  symbol?: string;
  decimals: number;
  supply: number;
  receivers: { address: string; amount: number }[];
  environment: Environments;
}): Promise<CommitPsbt> {
  const [_addressType, network] = getAddressType(address);
  let utxos = await getUTXOs(environment);

  // the name of the token
  let rune = SpacedRune.fromString(ticker);
  // let rune = SpacedRune.fromString("CL.RUNEBETA.HELLO");
  const runeStone = new RuneStone(
    // if you want to mint tokens when issuing a token, then you need to pass this parameter.
    {
      edicts: receivers.map(
        ({ amount }, index) =>
          ({
            // always 0
            id: new RuneId(BigInt(0), BigInt(0)),
            // amount to mint
            amount: BigInt(amount),
            // the amount to be minted will be on which output?
            output: BigInt(index + 1),
          }) as any,
      ),
      // edicts: [],
      etching: new Etching({
        spacers: (rune as SpacedRune).spacers,
        // like decimals.
        divisibility: decimals,
        // the name of the token, if null, it will be automatically generated.
        rune: (rune as SpacedRune).rune,
        // this is not the name of the token, only one character is supported here
        symbol,
        // symbol: "M",
        premine: BigInt(supply),
        // premine: BigInt(1e10 * 1e2),
      }), // etching
      mint: null,
      // receiver output index
      pointer: BigInt(1),
    },
  );

  const encipher = runeStone.encipher();
  const revealOutputs = [
    {
      script: encipher,
      value: 0,
    },
    ...receivers.map(({ address }) => ({
      script: addressToOutputScript(address),
      value: getOutputValue(network),
    })),
    // {
    //   script: bitcoin.address.toOutputScript(address, network),
    //   value: 1,
    // },
  ];

  let pubkeyBuffer = Buffer.from(pubkey, "hex");

  // compose tapscript
  let revealWallet = randomP2TRWallet(network);
  const tapInternalKey = toXOnly(revealWallet.pubkey);

  let payload = Buffer.from(runeStone.etching?.rune?.commitment()!);
  const { scriptP2TR, hashLockP2TR } = prepareCommitRevealConfig(
    tapInternalKey,
    payload,
    network,
  );

  let txResult = prepareCommitAndRevealTx({
    // safe btc utxos
    utxos,
    feeRate,
    network,
    // reveal input number, default is 1
    revealInputs: 1,
    // reveal outputs
    revealOutputs,
    payload,
  });

  console.table(txResult);

  const commitOutputs = [
    {
      address: scriptP2TR.address!,
      value: txResult.revealNeed,
    },
  ];

  if (txResult.change) {
    commitOutputs.push({
      address,
      value: txResult.change,
    });
  }

  let commitPsbt = toPsbt({
    tx: {
      inputs: txResult.inputs,
      outputs: commitOutputs,
      feeRate,
      address,
    },
    pubkey: pubkeyBuffer,
    rbf: true,
  });

  return {
    psbtHex: commitPsbt.toHex(),
    revealOutputs,
    hashLockP2TR,
    txResult,
    revealWalletKeypair: revealWallet.keyPair,
  };
}

export async function generatePsbtRevealHex({
  address,
  signedCommitPsbtHex,
  hashLockP2TR,
  revealOutputs,
  txResult,
  revealWalletKeypair,
}: {
  address: string;
  signedCommitPsbtHex: string;
  hashLockP2TR: bitcoin.payments.Payment;
  revealOutputs: { script: Buffer; value: number }[];
  txResult: PrepareCommitAndRevealTxResult;
  revealWalletKeypair: ECPairInterface;
}): Promise<{
  psbtHex: string;
  commitTxId: string;
}> {
  const [_addressType, network] = getAddressType(address);

  let signedCommitPsbt = bitcoin.Psbt.fromHex(signedCommitPsbtHex);
  let commitTx = signedCommitPsbt.extractTransaction(true);
  let commitTxRawHex = commitTx.toHex();
  const commitTxId = commitTx.getId();

  // compose reveal TX
  const tapLeafScript = {
    leafVersion: hashLockP2TR!.redeem!.redeemVersion!,
    script: hashLockP2TR!.redeem!.output!,
    controlBlock: hashLockP2TR.witness![hashLockP2TR.witness!.length - 1],
  };

  let psbtReveal = new Psbt({ network });
  psbtReveal.setVersion(1);

  psbtReveal.addInput({
    hash: commitTxId,
    index: 0,
    witnessUtxo: { value: txResult.revealNeed, script: hashLockP2TR.output! },
    tapLeafScript: [tapLeafScript],
    sequence: 0xffffffff - 2,
  });
  psbtReveal.addOutputs(revealOutputs);

  const fundingKeypair = getKeypairInfo(revealWalletKeypair, network);

  psbtReveal.signInput(0, fundingKeypair.childNode);
  psbtReveal.finalizeAllInputs();
  let revealTx = psbtReveal.extractTransaction(true);
  const revealTxRawHex = revealTx.toHex();

  let stone = RuneStone.fromTransaction(revealTx);

  return { psbtHex: revealTxRawHex, commitTxId };
}

export async function broadcastPsbtHex(
  signedPsbtHex: string,
  networkType: NetworkType,
) {
  const env = getEnvironmentByNetwork(networkType);
  let signedPsbt = bitcoin.Psbt.fromHex(signedPsbtHex);
  const tx = signedPsbt.extractTransaction(true);
  const rawhex = tx.toHex();
  return await broadcastRequest(rawhex, env);
}
