"use client";
import { useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;

type UseCopyToClipboard = {
  copiedText: CopiedValue;
  copy: CopyFn;
  isCopying: boolean;
};

type Options = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useCopyToClipboard = (options?: Options): UseCopyToClipboard => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  // loading state
  const [isCopying, setIsCopying] = useState(false);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");

      return false;
    }

    setIsCopying(true);

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);

      options?.onSuccess?.();

      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);

      options?.onError?.();

      return false;
    } finally {
      // Waiting 2s before resetting the state
      // 2s is during the toast success animation ends
      setTimeout(() => {
        setIsCopying(false);
      }, 2000);
    }
  };

  return { copiedText, copy, isCopying };
};
