import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SearchParamKey, SortDirection } from "@/lib/rune/definitions";
import { stringifyUrl } from "@/lib/utils";
import * as queryString from "querystring";

export function useTableSorting(sorting: SortingState): {
  isPending: boolean;
  onSortingChange: OnChangeFn<SortingState>;
} {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const onSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        const sorts = updaterOrValue(sorting);
        const sort = sorts.at(0);

        const sortId = sort?.id;
        let sortDirection: SortDirection | undefined;

        if (sortId) {
          sortDirection = sort.desc ? SortDirection.Desc : SortDirection.Asc;
        }

        startTransition(() => {
          router.push(
            stringifyUrl({
              url: pathname,
              query: {
                ...queryString.parse(searchParams.toString()),
                [SearchParamKey.SortBy]: sortId,
                [SearchParamKey.SortOrder]: sortDirection,
              },
            }),
          );
        });
      }
    },
    [pathname, router, searchParams, sorting],
  );

  return {
    isPending,
    onSortingChange,
  };
}
