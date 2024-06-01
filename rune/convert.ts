import {
  AddressRuneBackend,
  AvailableUTXO,
  MarketRune,
  Rune,
  RuneAddress,
  RuneBackend,
} from "@/lib/rune/definitions";

export function convertRune(rune: RuneBackend): Rune {
  return {
    ...rune,
    term: 0,
    end_block: 0,
    limit: "0",
    is_hot: false,
    is_nft: false,
    collection_total_supply: null,
    collection_metadata: null,
    collection_owner: null,
    collection_description: null,
    nft_metadata: null,
    nft_collection: null,
    holder_count: 0,
    transaction_count: 0,
    is_collection: false,
    collection_minted: 0,
    unit: "1",
    deploy_transaction: rune.tx_hash,
    rune: rune.spaced_rune,
    createdAt: new Date(Number(rune.timestamp) * 1000).toISOString(),
    updatedAt: new Date(Number(rune.timestamp) * 1000).toISOString(),
  };
}

export function convertRunes(runes: RuneBackend[]): Rune[] {
  return runes.map(convertRune);
}

// export interface MarketRune {
//   id: string;
//   last_price: string;
//   floor_price: string;
//   rune_id: string;
//   rune_name: string;
//   change_24h: string;
//   volume_24h: string;
//   total_volume: string;
//   marketcap: string;
//   total_supply: string;
//   token_holders: number;
//   unit: string;
//   order_sold: number;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: null;
// }

export function convertMarketRune(rune: RuneBackend): MarketRune {
  return {
    ...convertRune(rune),
    id: rune.id.toString(),
    last_price: "0",
    floor_price: "0",
    rune_name: rune.spaced_rune,
    change_24h: "0",
    volume_24h: "0",
    total_volume: "0",
    marketcap: "0",
    total_supply: "0",
    token_holders: 0,
    order_sold: 0,
    deletedAt: null,
  };
}

export function convertMarketRunes(runes: RuneBackend[]): MarketRune[] {
  return runes.map(convertMarketRune);
}

// export interface AvailableUTXO {
//   txid: string;
//   vout: number;
//   value: number;
//   amount: string;
//   type: string;
//   address: string;
// }

// export interface AddressRuneBackend {
//   address: string;
//   spaced_rune: string;
//   id: string;
//   tx_hash: string;
//   vout: number;
//   rune_id: string;
//   balance_value: string;
// }
export function convertAvailableUTXO(utxo: AddressRuneBackend): AvailableUTXO {
  return {
    ...utxo,
    txid: utxo.tx_hash,
    amount: utxo.balance_value,
    value: Number(utxo.balance_value),
    type: "payment",
  };
}

export function convertAvailableUTXOs(
  utxos: AddressRuneBackend[],
): AvailableUTXO[] {
  return utxos?.map(convertAvailableUTXO);
}

// export interface AddressRuneBackend {
//   address: string;
//   spaced_rune: string;
//   id: string;
//   tx_hash: string;
//   vout: number;
//   rune_id: string;
//   balance_value: string;
// }

export function convertAddressRune(utxo: AddressRuneBackend): AvailableUTXO {
  return {
    ...utxo,
    txid: utxo.tx_hash,
    amount: utxo.balance_value,
    value: Number(utxo.balance_value),
    type: "payment",
  };
}

export function convertAddressRuneBackend(
  rune: AddressRuneBackend,
): RuneAddress {
  return {
    ...rune,
    amount: rune.balance_value,
    amount_decimal: rune.balance_value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rune: {
      ...rune,
      deploy_transaction: rune.tx_hash,
      timestamp: new Date().getTime() / 1000,
      rune: rune.spaced_rune,
      divisibility: 1,
      supply: rune.balance_value,
      term: 0,
      end_block: 0,
      limit: rune.balance_value,
      burned: "0",
      symbol: "",
      is_collection: false,
      collection_total_supply: null,
      collection_minted: 0,
      collection_metadata: null,
      collection_owner: null,
      collection_description: null,
      is_nft: false,
      nft_metadata: null,
      nft_collection: null,
      holder_count: 0,
      transaction_count: 0,
      is_hot: false,
      unit: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function convertAddressRunesBackend(
  runes: AddressRuneBackend[],
): RuneAddress[] {
  return runes.map(convertAddressRuneBackend);
}
