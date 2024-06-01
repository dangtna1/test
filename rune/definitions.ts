export interface ErrorResponse<E> {
  data: E;
  message: string;
  statusCode: number;
}

export type ErrorData = Record<string, Record<string, string>>;

export type RuneResponse<T, E = ErrorResponse<ErrorData>> =
  | { ok: true; status: number; body: T }
  | { ok: false; status: number; body: E };

export enum DataType {
  JSON = "json",
  File = "file",
}

export interface TransactionsPagination<T> {
  data: {
    limit: number;
    offset: number;
    total: number;
    transactions: T[];
  };
  statusCode: number;
}

export interface RuneDataResponse<T> {
  data: T;
  statusCode: number;
}

export interface RunesPagination<T> {
  data: {
    limit: number;
    offset: number;
    total: number;
    runes: T[];
  };
  statusCode: number;
}

export interface MarketRuneResponse<T> {
  data: T;
  statusCode: number;
}

export interface UTXOResponse<T> {
  data: {
    availableBalance: number;
    availableUTXOs: T[];
    listedUTXOs: T[];
    stakingUTXOs: T[];
    boradcastedUTXOs: T[];
  };
  statusCode: number;
}

export interface MarketStats {
  statusCode: number;
  data: {
    volume_24h: string;
    total_volume: string;
    marketcap: string;
    order_sold: string;
  };
}

export enum SearchParamKey {
  Offset = "offset",
  Limit = "limit",
  Text = "text",
  IgnoreInvalid = "ignoreInvalid",
  SortBy = "sortBy",
  SortOrder = "sortOrder",
  Search = "search",
  Status = "status",
  Type = "type",
  Address = "address",
  Query = "query",
}

export enum Tag {
  Transactions = "transactions",
  Transaction = "transaction",
  MarketRunes = "marketRunes",
  MarketRune = "marketRune",
  MarketStats = "marketStats",
  RuneOrders = "runeOrders",
  Runes = "runes",
  Rune = "rune",
  TopAddress = "topAddress",
  RuneTransactions = "runeTransactions",
  AddressRunes = "addressRunes",
  AddressTransactions = "addressTransactions",
  MyUtxo = "myUtxo",
  BlockSyncNumber = "blockSyncNumber",
  DailyTxCount = "dailyTxCount",
  Stats = "stats",
  BtcPrice = "btcPrice",
  RecommendedFee = "recommendedFee",
  RequestLogin = "requestLogin",
  VerifyLogin = "verifyLogin",
  AvailableBalance = "availableBalance",
  RuneMetadata = "runeMetadata",
  UserRune = "userRune",
  RuneAddress = "runeAddress",
  MyRuneBackend = "myRuneBackend",
  SelectUtxos = "selectUtxos",
  MyUtxoBackend = "myUtxoBackend",
  Search = "search",
}

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export interface PaginationQuery {
  limit?: number;
  offset?: number;
  text?: string;
  ignoreInvalid?: boolean;
}

export interface PaginationMeta {
  limit: number;
  offset: number;
  total: number;
}

export interface TransactionQuery extends PaginationQuery {
  runeId?: string;
  address?: string;
}

export interface SearchQuery extends PaginationQuery {
  query?: string;
}

export interface MarketRunesQuery extends PaginationQuery {
  sortBy?: string;
  sortOrder?: SortDirection;
  search?: string;
}

export interface RuneOrdersQuery extends PaginationQuery {
  sortBy?: string;
  sortOrder?: SortDirection;
  status?: string | string[];
  owner_id?: string;
}

export interface SellOrderBody {
  seller: {
    makerFeeBp: number;
    sellerRuneAddress: string;
    price: number;
    runeItem: {
      txid: string;
      vout: number;
      outputValue: number;
    };
    sellerReceiveAddress: string;
    unsignedListingPSBTBase64?: string;
    signedListingPSBTBase64?: string;
  };
}

export interface BuyOrderBody {
  buyerState: BuyerState;
  orderIds: number[];
  feeRate: number;
}

export interface EtchRuneBody {
  commitTxId: string;
  commitBlockHeight: number;
  revealTxRawHex: string;
  runeName: string;
}

export interface BuyerState {
  buyer: BuyerOrder;
}

export interface BuyerOrder {
  buyerAddress: string;
  buyerTokenReceiveAddress: string;
  takerFeeBp: number;
  buyerPaymentUTXOs: BuyerPaymentUTXO[];
  feeRateTier: number;
  unsignedBuyingPSBTBase64?: string;
  unsignedBuyingPSBTInputSize?: number;
  signedBuyingPSBTBase64?: string;
  itemMapping?: ItemMapping[];
}

export interface BuyerPaymentUTXO {
  txid: string;
  vout: number;
  value: number;
}

export interface ItemMapping {
  index: number;
  id: string;
}

export interface RunesQuery extends PaginationQuery {
  sortOrder?: SortDirection;
  sortBy?: string;
  type?: string;
}

export interface Transaction {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  fee: number;
  hex: string;
  block_number: number;
  timestamp: number;
  vin_runes: string[];
  vout_runes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vin {
  txid: string;
  type: string;
  vout: number;
  value: number;
  address: string;
  sequence: number;
  scriptSig: ScriptSig;
  txinwitness: string[];
  runeInject?: RuneInject[];
}

export interface ScriptSig {
  asm: string;
  hex: string;
}

export interface Vout {
  n: number;
  value: number;
  scriptPubKey: ScriptPubKey;
  runeInject?: RuneInject[];
  rune_stone?: RuneStone;
}

export interface RuneStone {
  edicts: Edict[];
  etching: null;
  burn: boolean;
}

export interface Edict {
  id: string;
  amount: number;
  output: number;
}

export interface RuneInject {
  rune_id: string;
  deploy_transaction: string;
  timestamp: number;
  rune: string;
  divisibility: number;
  supply: string;
  term: number;
  end_block: number;
  limit: string;
  burned: string;
  symbol: string;
  is_collection: boolean;
  collection_total_supply: null;
  collection_minted: number;
  collection_metadata: null;
  collection_owner: null;
  collection_description: null;
  is_nft: boolean;
  nft_metadata: null;
  nft_collection: null;
  holder_count: number;
  transaction_count: number;
  is_hot: boolean;
  unit: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  txid: string;
  spend_txid: null;
  index: number;
  utxo_type: string;
  amount: string;
  address: string;
  is_etch: boolean;
  is_claim: boolean;
}

export interface ScriptPubKey {
  asm: string;
  hex: string;
  desc: string;
  type: string;
  address?: string;
}

export interface MarketRune {
  id: string;
  last_price: string;
  floor_price: string;
  rune_id: string;
  rune_name: string;
  change_24h: string;
  volume_24h: string;
  total_volume: string;
  marketcap: string;
  total_supply: string;
  token_holders: number;
  unit: string;
  order_sold: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

export interface RuneOrder {
  id: number;
  rune_id: string;
  rune_name: string;
  rune_hex: string;
  amount_rune: string;
  price_per_unit: string;
  amount_rune_remain_seller: string;
  amount_satoshi: string;
  seller_ordinal_address: string;
  service_fee: string;
  type: string;
  status: string;
  txs: string;
  received_address: null;
  rune_utxo: RuneUtxo[];
  total_value_input_seller: string;
  utxo_address_type: string;
  utxo_address: string;
  unit: string;
  confirmed: boolean;
  confirmed_at_block: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  owner_id: string;
  buyer_id: null;
  owner: Owner;
  buyer?: Buyer;
}

export interface Buyer {
  wallet_address: string;
  twitter_id: string;
  twitter_profile: TwitterProfile;
  deletedAt: null;
}

export interface TwitterProfile {
  id: string;
  name: string;
  username: string;
}

export interface Owner {
  wallet_address: string;
  twitter_id: null;
  twitter_profile: null;
  deletedAt: null;
}

export interface RuneUtxo {
  txid: string;
  vout: number;
  value: number;
  amount: string;
  type: string;
  address: string;
}

export interface Rune {
  rune_id: string;
  deploy_transaction: string;
  timestamp: number;
  rune: string;
  divisibility: number;
  supply: string;
  term: number;
  end_block: number;
  limit: string;
  burned: string;
  symbol: string;
  is_collection: boolean;
  collection_total_supply: null;
  collection_minted: number;
  collection_metadata: null;
  collection_owner: null;
  collection_description: null;
  is_nft: boolean;
  nft_metadata: null;
  nft_collection: null;
  holder_count: number;
  transaction_count: number;
  is_hot: boolean;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopAddress {
  id: string;
  address: string;
  rune_id: string;
  amount: string;
  amount_decimal: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuneAddress extends TopAddress {
  rune: Rune;
}

export interface Stats {
  totalRune: number;
  totalFreeMintRune: number;
  totalTransaction: number;
  totalFee: number;
  totalHolder: number;
  todayRateTransaction: number;
}

export interface RecommendFee {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

export interface User {
  address: string;
}

export interface Login {
  accessToken: string;
  user: User;
}

export interface AvailableBalance {
  availableBalance: number;
  availableUTXOs: AvailableUTXO[];
}

export interface AvailableUTXO {
  txid: string;
  vout: number;
  value: number;
  amount: string;
  type: string;
  address: string;
}

export interface RuneMetadata {
  id: string;
  image: string;
  twitter: string;
  discord: string;
  website: string;
  description: string;
  alias: null;
  verified: boolean;
  runeId: string;
  twitterProfile: TwitterProfile;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TwitterProfile {
  id: string;
  name: string;
  username: string;
}

export interface RuneBackend {
  id: number;
  tx_hash: string;
  rune_id: string;
  burned: string;
  divisibility: number;
  etching: string;
  mints: string;
  number: string;
  mint_entry: MintEntry;
  rune: string;
  spacers: number;
  supply: string;
  spaced_rune: string;
  symbol: string;
  timestamp: number;
}

export interface MintEntry {}

export interface AddressRuneBackend {
  address: string;
  spaced_rune: string;
  id: string;
  tx_hash: string;
  vout: number;
  rune_id: string;
  balance_value: string;
}

export interface OrderUTXO {
  txid: string;
  vout: number;
  status: OrderUTXOStatus;
  value: number;
}

export interface OrderUTXOStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export enum SearchBackendType {
  Address = "address",
  Tx = "transaction",
  Rune = "rune",
}

export interface SearchData {
  type: SearchBackendType;
  data: RuneBackend[] | OrderUTXO[] | Transaction[];
  query: string;
}
