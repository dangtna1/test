// Enum for environments
//
// Used to determine the api endpoint to use (The switch environment button)
import { NetworkType } from "@/lib/utils/network-utils";

export enum Environments {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

export const DEFAULT_ENV = Environments.MAINNET;
export const envs = [DEFAULT_ENV, Environments.TESTNET];

export function getPathnameByEnv(pathname: string, env: Environments) {
  return `/${env}${pathname}`;
}

export const ENVIRONMENT_LINKS = [
  {
    href: "/",
    label: "Mainnet",
    icon: "/svg/bitcoin.svg",
  },
  {
    href: "/testnet",
    label: "Testnet",
    icon: "/svg/bitcoin-testnet.svg",
  },
] as const;

export function getEnvironment(environment: string) {
  switch (environment) {
    case "mainnet":
      return ENVIRONMENT_LINKS[0];
    case "testnet":
      return ENVIRONMENT_LINKS[1];
    default:
      return ENVIRONMENT_LINKS[0];
  }
}

export function getBasePathname(pathname: string, environment: string) {
  const basePathname = pathname.replace(`/${environment}`, "");
  return basePathname === "" ? "/" : basePathname;
}

export function getEnvironmentByNetwork(network: NetworkType) {
  switch (network) {
    case NetworkType.livenet:
      return Environments.MAINNET;
    case NetworkType.testnet:
      return Environments.TESTNET;
    default:
      return Environments.MAINNET;
  }
}
