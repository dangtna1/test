import { format, formatDistance, parseISO } from "date-fns";

export function formatUnixTimestamp(
  unixTimestamp: number,
  formatType = "DD/mm/YYYY",
): string {
  return format(new Date(unixTimestamp * 1000), formatType);
}

export function formatDate(date: string, formatType = "DD/mm/YYYY"): string {
  return format(parseISO(date), formatType);
}

export function getDistanceToNow(date: string): string {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });
}
