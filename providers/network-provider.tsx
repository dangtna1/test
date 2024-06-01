"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { NetworkType } from "@/lib/utils/network-utils";
import { Environments } from "@/lib/constants/environment-links";
import { useParams } from "next/navigation";

interface NetworkContextType {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextType>({
  network: NetworkType.testnet,
  setNetwork: () => {},
});

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw Error(
      "Feature flag hooks can only be used by children of NetworkProvider.",
    );
  } else {
    return context;
  }
}

export default function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState(NetworkType.livenet);

  const params = useParams<{ env: Environments }>();

  useEffect(() => {
    if (params.env === Environments.MAINNET) {
      setNetwork(NetworkType.livenet);
    } else {
      setNetwork(NetworkType.testnet);
    }
  }, [params.env]);

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
