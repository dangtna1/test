"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { handleError, sleep } from "@/lib/utils/utils";
import { unisatUtils } from "@/lib/utils/unisat-utils";
import { useNetwork } from "@/lib/providers/network-provider";
import { useSession } from "next-auth/react";

interface UnisatContextType {
  isInstalled: boolean;
  isConnected: boolean;
  address: string;
  pubkey: string;
  connect: () => void;
  signMessage: (msg: string) => Promise<string>;
  signPsbt: (psbt: string, isFinalize?: boolean) => Promise<string>;
  disconnect: () => void;
}

const UnisatContext = createContext<UnisatContextType>({
  isInstalled: false,
  isConnected: false,
  address: "",
  pubkey: "",
  connect: () => {},
  signMessage: (msg: string) => Promise.resolve(""),
  signPsbt: (psbt: string) => Promise.resolve(""),
  disconnect: () => {},
});

export function useUnisat() {
  const context = useContext(UnisatContext);
  if (!context) {
    throw Error(
      "Feature flag hooks can only be used by children of UnisatProvider.",
    );
  } else {
    return context;
  }
}

export default function UnisatProvider({ children }: { children: ReactNode }) {
  const { network } = useNetwork();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [pubkey, setPubkey] = useState("");
  const session = useSession();

  const handleAccountsChanged = useCallback(
    (_accounts: string[]) => {
      if (address === _accounts[0]) {
        // prevent from triggering twice
        return;
      }
      if (_accounts.length > 0) {
        setAddress(_accounts[0]);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    },
    [address],
  );

  useEffect(() => {
    async function init() {
      let install = !!window.unisat;
      setIsInstalled(install);

      // 额外检查
      for (let i = 0; i < 10 && !install; i += 1) {
        await sleep(100 + i * 100);
        install = !!window.unisat;
        if (install) {
          setIsInstalled(install);
          break;
        }
      }

      if (install) {
        if (session.status === "authenticated") {
          // only init data when user is authenticated
          const address = await unisatUtils.getAccounts();
          if (address) {
            setPubkey(await unisatUtils.getPublicKey());
            //     connected
            setIsConnected(true);
            setAddress(address);
          }
          window.unisat.on("accountsChanged", handleAccountsChanged);
        }
      }
    }

    init().then().catch(handleError);
    return () => {
      window?.unisat?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [handleAccountsChanged, session.status]);

  const connect = useCallback(async () => {
    try {
      await unisatUtils.checkNetwork(network);
      const address = await unisatUtils.requestAccounts();
      if (address) {
        setPubkey(await unisatUtils.getPublicKey());
        setIsConnected(true);
        setAddress(address);
      }
    } catch (e) {
      handleError(e);
    }
  }, [network]);

  useEffect(() => {
    async function onAppNetworkChange() {
      try {
        await unisatUtils.checkNetwork(network);
        const address = await unisatUtils.getAccounts();
        if (address) {
          setAddress(address);
        }
      } catch (e) {
        handleError(e);
      }
    }

    if (isConnected) {
      onAppNetworkChange().then();
    }
  }, [isConnected, network]);

  useEffect(() => {
    // Check address change
  }, []);

  const signMessage = useCallback((msg: string) => {
    return unisatUtils.signMessage(msg, "bip322-simple");
  }, []);

  const signPsbt = useCallback((psbt: string, autoFinalize = true) => {
    return unisatUtils.signPsbt(psbt, autoFinalize);
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress("");
    setPubkey("");
  }, []);

  const value = {
    isInstalled,
    isConnected,
    address,
    pubkey,
    connect,
    signMessage,
    signPsbt,
    disconnect,
  };

  return (
    <UnisatContext.Provider value={value}>{children}</UnisatContext.Provider>
  );
}
