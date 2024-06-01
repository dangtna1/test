"use client";
import { useEffect, useState } from "react";
import { RecommendFee } from "@/lib/rune/definitions";
import { getRecommendedFee } from "@/lib/rune";
import { Environments } from "@/lib/constants/environment-links";
import { useParams } from "next/navigation";

const RECOMMENDED_FEE_INTERVAL = 20000;

export function useRecommendedFee({
  onUpdate,
}: {
  onUpdate?: (fee: RecommendFee) => void;
}) {
  const [recommendedFee, setRecommendedFee] = useState({
    hourFee: 0,
    halfHourFee: 0,
    fastestFee: 0,
    economyFee: 0,
    minimumFee: 0,
  });

  const [feeSuggestions, setFeeSuggestions] = useState([
    { label: "Normal", value: 0 },
    { label: "Fast", value: 0 },
    // { label: "Custom", value: 0 },
  ]);
  const params = useParams<{ env: Environments }>();

  useEffect(() => {
    async function fetchRecommendedFee() {
      try {
        // const response = await fetch("/api/recommended-fee");
        const { ok, body } = await getRecommendedFee(params.env);

        if (!ok) {
          return;
        }

        const data = body.data;

        setRecommendedFee(body.data);
        onUpdate && onUpdate(body.data);

        if (
          data.halfHourFee === feeSuggestions?.[0]?.value &&
          data.fastestFee === feeSuggestions?.[1]?.value
        ) {
          return;
        }
        setFeeSuggestions([
          { label: "Normal", value: data.halfHourFee },
          { label: "Fast", value: data.fastestFee },
          // {
          //   label: "Custom",
          //   value: Math.round((data.halfHourFee + data.fastestFee) / 2),
          // },
        ]);
      } catch (error) {
        console.error("Failed to get recommended fee", error);
      }
    }
    fetchRecommendedFee();
    const interval = setInterval(() => {
      fetchRecommendedFee();
    }, RECOMMENDED_FEE_INTERVAL);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUpdate]);

  return { recommendedFee, feeSuggestions };
}
