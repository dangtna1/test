import { Environments } from "@/lib/constants/environment-links";

export const baseUrl = process.env.NEXT_PUBLIC_RUNE_API_URL;
export const backendBaseUrl = process.env.RUNE_BACKEND_API_URL || "";
export const frontendEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;

export function getBaseUrlByEnv(env: Environments) {
  switch (env) {
    case Environments.MAINNET:
      if (frontendEnv === "testnet") {
        return process.env.NEXT_PUBLIC_DEV_RUNE_BACKEND_API_URL_MAINNET;
      }
      return process.env.NEXT_PUBLIC_PROD_RUNE_BACKEND_API_URL_MAINNET;
    case Environments.TESTNET:
      if (frontendEnv === "testnet") {
        return process.env.NEXT_PUBLIC_DEV_RUNE_BACKEND_API_URL_TESTNET;
      }
      return process.env.NEXT_PUBLIC_PROD_RUNE_BACKEND_API_URL_TESTNET;

    default:
      if (frontendEnv === "mainnet") {
        return process.env.NEXT_PUBLIC_PROD_RUNE_BACKEND_API_URL_MAINNET;
      }
      return process.env.NEXT_PUBLIC_PROD_RUNE_BACKEND_API_URL_MAINNET;
  }
}

export const endpoint = {
  address: {
    runes: {
      // GET /address/{address}/runes
      // getAll: (address: string) => `/address/${address}/runes`,
      getAll: (address: string) => `/runes/utxo/${address}`,
    },
    txs: {
      // GET /address/{address}/txs
      // getAll: (address: string) => `/address/${address}/txs`,
      getAll: `/transactions`,
    },
  },
  auth: {
    requestLogin: (address: string) => `/auth/request/login/${address}`,
    verify: "/auth/verify",
  },
  transaction: {
    // GET /transaction/{id}
    // getById: (id: string) => `/transaction/${id}`,
    getById: (id: string) => `/transactions/${id}`,
    // GET /transaction
    // getAll: "/transaction",
    getAll: "/transactions",
  },
  market: {
    runes: {
      // GET /market/runes/{id}
      getById: (id: string) => `/market/runes/${id}`,
      // GET /market/runes
      getAll: "/market/runes",
      getAllBackend: "/markets/runes",
    },
    // GET /market/stats
    // stats: "/market/stats",
    stats: "/markets/stats",
    orders: {
      rune: {
        // GET /market/orders/rune/{id}
        getById: (id: string) => `/market/orders/rune/${id}`,
        getByIdBackend: (id: string) => `/markets/orders/rune/${id}`,
      },
      sell: {
        create: "/markets/orders/sell",
        unsignedPsbt: "/markets/orders/sell/unsigned-psbt",
        cancel: "/markets/orders/sell/cancel",
      },
      buy: {
        merge: "/markets/orders/buy/merge-signed-psbt",
        unsignedPsbt: "/markets/orders/buy/unsigned-psbt",
        selectUtxos: "/markets/orders/buy/select-utxos",
      },
    },
  },
  rune: {
    // GET /rune/{id}
    // getById: (id: string) => `/rune/${id}`,
    getById: (id: string) => `/runes/${id}/info`,
    // GET /rune
    // getAll: "/rune",
    getAll: "/runes",
    top: {
      // GET /rune/{id}/top
      // getById: (id: string) => `/rune/${id}/top`,
      getById: (id: string) => `/runes/${id}/top`,
    },
    txs: {
      // GET /rune/{id}/txs
      // getAll: (id: string) => `/rune/${id}/txs`,
      getAll: `/transactions`,
    },
    address: "/rune/address",
  },
  runes: {
    myUtxo: "/runes/my-utxo",
    availableBalance: "/runes/available-balance",
    etch: "/runes/etch",
  },
  stats: {
    blockSyncNumber: "/stats/block-sync-number",
    dailyTxCount: "/stats/daily-tx-count",
    overview: "/stats",
    btcPrice: "/stats/btc-price",
    recommended: "/stats/recommended-fee",
  },
  runeInfos: {
    byRuneId: (runeId: string) => `/rune-infos/by-rune/${runeId}`,
  },
  users: {
    rune: {
      // GET /users/my-runes
      getMyRune: "/users/my-runes",
      getMyRuneById: (runeId: string) => `/users/my-runes/${runeId}`,
    },
    myUtxo: "/users/my-utxo",
    search: "/users/search",
    profile: "/users/profile",
  },
} as const;
