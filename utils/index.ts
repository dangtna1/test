import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IStringifyOptions } from "qs";
import { stringify } from "qs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringifyUrl(
  object: {
    url: string;
    query: object;
  },
  options?: IStringifyOptions,
): string {
  return `${object.url}?${stringify(object.query, options)}`;
}

export function joinString(
  array: (string | null | undefined)[],
  separator = " ",
): string {
  return array.filter(Boolean).join(separator);
}
