"use server";

import {
  parsePaginationParams,
  parseStringParam,
  SearchParams,
} from "@/lib/types/params";
import { endpoint, getBaseUrlByEnv } from "@/lib/rune/endpoint";
import {
  AddressRuneBackend,
  BuyerState,
  BuyOrderBody,
  DataType,
  EtchRuneBody,
  MarketRune,
  MarketRuneResponse,
  MarketRunesQuery,
  MarketStats,
  OrderUTXO,
  RecommendFee,
  Rune,
  RuneAddress,
  RuneDataResponse,
  RuneOrder,
  RuneOrdersQuery,
  RuneResponse,
  RunesPagination,
  RunesQuery,
  SearchData,
  SearchParamKey,
  SearchQuery,
  SellOrderBody,
  SortDirection,
  Stats,
  Tag,
  TopAddress,
  Transaction,
  TransactionQuery,
  TransactionsPagination,
} from "@/lib/rune/definitions";
import { stringifyUrl } from "@/lib/utils";
import { runeFetch } from "@/lib/rune/fetcher";
import { Environments } from "@/lib/constants/environment-links";

const jwt =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNThkOTFjNDMtZGRiZS00ZGY1LWI2NGEtZmIzYWY5MGI5MWU1Iiwid2FsbGV0X2FkZHJlc3MiOiJiYzFxdWZzbGwzNHRtejhyMDJtZzZ5dXBrbWVmbXZheHprMjd4OTlxejAiLCJ0d2l0dGVyX2lkIjpudWxsLCJ0d2l0dGVyX3Byb2ZpbGUiOm51bGwsInR1dG9yaWFsIjowLCJjcmVhdGVkQXQiOiIyMDI0LTAzLTE0VDA4OjE3OjE0LjA0M1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTAzLTE0VDA4OjE3OjE0LjA0M1oiLCJkZWxldGVkQXQiOm51bGx9LCJpYXQiOjE3MTE0NTAxMzUsImV4cCI6MTcxMTcwOTMzNX0.ZanYXBP4fRubPpJIjpMgjjjWfYG9W8xz0JYWAK23OBA";

export async function getTransactions(
  searchParams: SearchParams,
  environment = Environments.MAINNET,
): Promise<RuneResponse<TransactionsPagination<Transaction>>> {
  const { offset, limit } = parsePaginationParams(searchParams);

  const query: TransactionQuery = {
    offset,
    text: parseStringParam(searchParams[SearchParamKey.Text]),
    ignoreInvalid: parseStringParam(
      searchParams[SearchParamKey.IgnoreInvalid] || true,
    ),
    limit,
  };

  return runeFetch<TransactionsPagination<Transaction>>(
    stringifyUrl({ query, url: endpoint.transaction.getAll }),
    {
      next: { tags: [Tag.Transactions], revalidate: 0 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getTransaction(
  id: string,
  environment = Environments.MAINNET,
): Promise<RuneResponse<RuneDataResponse<Transaction>>> {
  return runeFetch<RuneDataResponse<Transaction>>(
    endpoint.transaction.getById(id),
    {
      next: { tags: [Tag.Transaction], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

// export async function getMarketRunes(
//   searchParams: SearchParams,
// ): Promise<RuneResponse<RunesPagination<MarketRune>>> {
//   const { offset, limit } = parsePaginationParams(searchParams);
//
//   const query: MarketRunesQuery = {
//     offset,
//     limit,
//     search: parseStringParam(searchParams[SearchParamKey.Search]),
//     sortBy: parseStringParam(searchParams[SearchParamKey.SortBy]),
//     sortOrder: parseStringParam(
//       searchParams[SearchParamKey.SortOrder] || SortDirection.Desc,
//     ),
//   };
//
//   return runeFetch<RunesPagination<MarketRune>>(
//     stringifyUrl({ query, url: endpoint.market.runes.getAll }),
//     {
//       next: { tags: [Tag.MarketRunes], revalidate: 5 },
//     },
//     DataType.JSON,
//     marketBaseUrl,
//     // backendBaseUrl,
//   );
// }

export async function getMarketRunesBackend(
  searchParams: SearchParams,
  environment = Environments.MAINNET,
): Promise<RuneResponse<RunesPagination<MarketRune>>> {
  const { offset, limit } = parsePaginationParams(searchParams);

  const query: MarketRunesQuery = {
    offset,
    limit,
    search: parseStringParam(searchParams[SearchParamKey.Search]),
    sortBy: parseStringParam(searchParams[SearchParamKey.SortBy]),
    sortOrder: parseStringParam(
      searchParams[SearchParamKey.SortOrder] || SortDirection.Desc,
    ),
  };

  return runeFetch<RunesPagination<MarketRune>>(
    stringifyUrl({ query, url: endpoint.market.runes.getAllBackend }),
    {
      next: { tags: [Tag.MarketRunes], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getMarketStats(
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketStats>> {
  return runeFetch<MarketStats>(
    endpoint.market.stats,
    {
      next: { tags: [Tag.MarketStats], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getMarketRune(
  id: string,
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<MarketRune>>> {
  return runeFetch<MarketRuneResponse<MarketRune>>(
    endpoint.market.runes.getById(id),
    {
      next: { tags: [Tag.MarketRune], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getRuneOrdersBackend(
  runeId: string,
  searchParams: SearchParams,
  queryDefaults?: RuneOrdersQuery,
  environment = Environments.MAINNET,
): Promise<RuneResponse<RunesPagination<RuneOrder>>> {
  const { offset, limit } = parsePaginationParams(searchParams);

  const query: RuneOrdersQuery = {
    offset,
    limit: limit === 10 ? queryDefaults?.limit || limit : limit,
    sortBy: parseStringParam(searchParams[SearchParamKey.SortBy]),
    sortOrder: parseStringParam(searchParams[SearchParamKey.SortOrder]),
    status: parseStringParam(
      searchParams[SearchParamKey.Status] || queryDefaults?.status,
    ),
    owner_id: parseStringParam(
      searchParams[SearchParamKey.Status] || queryDefaults?.owner_id,
    ),
  };

  return runeFetch<RunesPagination<RuneOrder>>(
    stringifyUrl(
      { query, url: endpoint.market.orders.rune.getByIdBackend(runeId) },
      { encode: false },
    ),
    {
      next: { tags: [Tag.RuneOrders], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getRunes(
  searchParams: SearchParams,
  environment = Environments.MAINNET,
): Promise<RuneResponse<RunesPagination<Rune>>> {
  const { offset, limit } = parsePaginationParams(searchParams);

  const query: RunesQuery = {
    offset,
    limit,
    sortBy: parseStringParam(searchParams[SearchParamKey.SortBy]),
    sortOrder: parseStringParam(searchParams[SearchParamKey.SortOrder]),
    type: parseStringParam(searchParams[SearchParamKey.Type]),
    text: parseStringParam(searchParams[SearchParamKey.Text]),
  };

  return runeFetch<RunesPagination<Rune>>(
    stringifyUrl({ query, url: endpoint.rune.getAll }),

    {
      next: { tags: [Tag.Runes], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getRune(
  id: string,
  environment = Environments.MAINNET,
): Promise<RuneResponse<RuneDataResponse<{ rows: Rune }>>> {
  return runeFetch<RuneDataResponse<{ rows: Rune }>>(
    endpoint.rune.getById(id),
    {
      next: { tags: [Tag.Rune], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getTopHolders(
  id: string,
  environment = Environments.MAINNET,
): Promise<RuneResponse<RuneDataResponse<{ topAddress: TopAddress[] }>>> {
  return runeFetch<RuneDataResponse<{ topAddress: TopAddress[] }>>(
    endpoint.rune.top.getById(id),
    {
      next: { tags: [Tag.TopAddress], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getRuneTransactions(
  runeId: string,
  searchParams: SearchParams,
  environment = Environments.MAINNET,
): Promise<RuneResponse<TransactionsPagination<Transaction>>> {
  const { offset, limit } = parsePaginationParams(searchParams);

  const query: TransactionQuery = {
    offset,
    text: parseStringParam(searchParams[SearchParamKey.Text] || runeId),
    ignoreInvalid: parseStringParam(searchParams[SearchParamKey.IgnoreInvalid]),
    limit,
    address: parseStringParam(searchParams[SearchParamKey.Address]),
    runeId,
  };

  return runeFetch<TransactionsPagination<Transaction>>(
    stringifyUrl({ query, url: endpoint.rune.txs.getAll }, { encode: false }),
    {
      next: { tags: [Tag.RuneTransactions], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getRunesByAddress(
  address: string,
  environment = Environments.MAINNET,
  // ): Promise<RuneResponse<RuneDataResponse<{ runes: RuneAddress[] }>>> {
  //   return runeFetch<RuneDataResponse<{ runes: RuneAddress[] }>>(
): Promise<RuneResponse<RuneDataResponse<RuneAddress[]>>> {
  return runeFetch<RuneDataResponse<RuneAddress[]>>(
    endpoint.address.runes.getAll(address),

    {
      next: { tags: [Tag.AddressRunes], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getAddressTransactions(
  address: string,
  searchParams: SearchParams,
  environment = Environments.MAINNET,
): Promise<RuneResponse<TransactionsPagination<Transaction>>> {
  const { offset, limit } = parsePaginationParams(searchParams);

  const query: TransactionQuery = {
    offset,
    ignoreInvalid: parseStringParam(searchParams[SearchParamKey.IgnoreInvalid]),
    limit,
    address,
  };

  return runeFetch<TransactionsPagination<Transaction>>(
    stringifyUrl({ query, url: endpoint.address.txs.getAll }),
    {
      next: { tags: [Tag.AddressTransactions], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getCurrentBlock(
  environment = Environments.MAINNET,
): Promise<RuneResponse<RuneDataResponse<number>>> {
  return runeFetch<RuneDataResponse<number>>(
    endpoint.stats.blockSyncNumber,
    {
      next: { tags: [Tag.BlockSyncNumber], revalidate: 0 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getBtcPrice(
  environment = Environments.MAINNET,
): Promise<RuneResponse<RuneDataResponse<number>>> {
  return runeFetch<RuneDataResponse<number>>(
    endpoint.stats.btcPrice,
    {
      next: { tags: [Tag.BtcPrice], revalidate: 0 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

// TODO: Integrate with the backend
export async function getDailyTxCount(
  environment = Environments.MAINNET,
): Promise<
  RuneResponse<RuneDataResponse<{ data: string[]; labels: string[] }>>
> {
  return runeFetch<RuneDataResponse<{ data: string[]; labels: string[] }>>(
    endpoint.stats.dailyTxCount,
    {
      next: { tags: [Tag.DailyTxCount], revalidate: 5 },
    },
  );
}

export async function getStats(
  environment = Environments.MAINNET,
): Promise<RuneResponse<RuneDataResponse<Stats>>> {
  return runeFetch<RuneDataResponse<Stats>>(
    endpoint.stats.overview,
    {
      next: { tags: [Tag.Stats], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getRecommendedFee(
  environment = Environments.MAINNET,
): Promise<RuneResponse<RuneDataResponse<RecommendFee>>> {
  return runeFetch<RuneDataResponse<RecommendFee>>(
    endpoint.stats.recommended,
    {
      next: { tags: [Tag.RecommendedFee], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function requestLogin({
  address,
  environment = Environments.MAINNET,
}: {
  address: string;
  environment?: Environments;
}): Promise<RuneResponse<RuneDataResponse<{ nonce: string }>>> {
  return runeFetch<RuneDataResponse<{ nonce: string }>>(
    endpoint.auth.requestLogin(address),
    {
      next: { tags: [Tag.RequestLogin], revalidate: 0 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function verifyLogin({
  address,
  signature,
  environment = Environments.MAINNET,
}: {
  address: string;
  signature: string;
  environment?: Environments;
}): Promise<RuneResponse<RuneDataResponse<{ token: string }>>> {
  return runeFetch<RuneDataResponse<{ token: string }>>(
    endpoint.auth.verify,
    {
      method: "POST",
      next: { tags: [Tag.VerifyLogin], revalidate: 0 },
      body: JSON.stringify({ address, signature }),
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function cancelOrder({
  orderIds,
  environment = Environments.MAINNET,
}: {
  orderIds: number[];
  environment?: Environments;
}): Promise<RuneResponse<RuneDataResponse<{ message: string }>>> {
  return runeFetch<RuneDataResponse<{ message: string }>>(
    endpoint.market.orders.sell.cancel,
    {
      method: "POST",
      next: { tags: [Tag.VerifyLogin], revalidate: 0 },
      body: JSON.stringify({ orderIds }),
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function generateUnsignedPsbt(
  body: SellOrderBody,
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<SellOrderBody>>> {
  return runeFetch<MarketRuneResponse<SellOrderBody>>(
    endpoint.market.orders.sell.unsignedPsbt,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function createSellOrder(
  body: SellOrderBody,
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<SellOrderBody>>> {
  return runeFetch<MarketRuneResponse<SellOrderBody>>(
    endpoint.market.orders.sell.create,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getUserRune(
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<AddressRuneBackend[]>>> {
  return runeFetch<MarketRuneResponse<AddressRuneBackend[]>>(
    endpoint.users.rune.getMyRune,
    {
      next: { tags: [Tag.UserRune], revalidate: 0 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function generateBuyUnsignedPsbt(
  body: BuyOrderBody,
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<BuyerState>>> {
  return runeFetch<MarketRuneResponse<BuyerState>>(
    endpoint.market.orders.buy.unsignedPsbt,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function createBuyOrder(
  body: BuyOrderBody,
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<BuyerState>>> {
  return runeFetch<MarketRuneResponse<BuyerState>>(
    endpoint.market.orders.buy.merge,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function etchRune(
  body: EtchRuneBody,
  environment = Environments.MAINNET,
): Promise<RuneResponse<{}>> {
  return runeFetch<{}>(
    endpoint.runes.etch,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getMyRuneById(
  id: string,
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<AddressRuneBackend[]>>> {
  return runeFetch<MarketRuneResponse<AddressRuneBackend[]>>(
    endpoint.users.rune.getMyRuneById(id),
    {
      next: { tags: [Tag.MyRuneBackend], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getSelectUtxos(
  ids: number[],
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<OrderUTXO[]>>> {
  return runeFetch<MarketRuneResponse<OrderUTXO[]>>(
    endpoint.market.orders.buy.selectUtxos,
    {
      method: "POST",
      next: { tags: [Tag.SelectUtxos], revalidate: 5 },
      body: JSON.stringify({ orderIds: ids }),
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getMyUtxosBackend(
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<OrderUTXO[]>>> {
  return runeFetch<MarketRuneResponse<OrderUTXO[]>>(
    endpoint.users.myUtxo,
    {
      next: { tags: [Tag.MyUtxoBackend], revalidate: 5 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}

export async function getSearch(
  search = "",
  environment = Environments.MAINNET,
): Promise<RuneResponse<MarketRuneResponse<SearchData>>> {
  const query: SearchQuery = {
    query: search,
  };

  return runeFetch<MarketRuneResponse<SearchData>>(
    stringifyUrl({ query, url: endpoint.users.search }),
    {
      next: { tags: [Tag.Search], revalidate: 0 },
    },
    DataType.JSON,
    getBaseUrlByEnv(environment),
  );
}
