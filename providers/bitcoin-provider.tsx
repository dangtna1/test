"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getBtcPrice, getCurrentBlock } from "@/lib/rune";
import { useParams } from "next/navigation";
import { Environments } from "@/lib/constants/environment-links";

interface BitcoinContextType {
  currentBlock: number;
  btcPrice: number;
}

const BitcoinContext = createContext<BitcoinContextType>({
  currentBlock: 0,
  btcPrice: 0,
});

export function useBitcoin() {
  const context = useContext(BitcoinContext);
  if (!context) {
    throw Error(
      "Feature flag hooks can only be used by children of BitcoinProvider.",
    );
  } else {
    return context;
  }
}

export default function BitcoinProvider({ children }: { children: ReactNode }) {
  const [currentBlock, setCurrentBlock] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const params = useParams<{ env: Environments }>();

  useEffect(() => {
    async function fetchBlock() {
      const { ok, body } = await getCurrentBlock(params.env);
      if (!ok) {
        console.error("Failed to get current block");
        return;
      }

      setCurrentBlock(body.data);
    }
    async function fetchBtcPrice() {
      const { ok, body } = await getBtcPrice(params.env);
      if (!ok) {
        console.error("Failed to get btc price");
        return;
      }

      setBtcPrice(body.data);
    }
    fetchBlock();
    fetchBtcPrice();
    const interval = setInterval(() => {
      fetchBlock();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BitcoinContext.Provider
      value={{
        currentBlock,
        btcPrice,
      }}
    >
      {children}
    </BitcoinContext.Provider>
  );
}
