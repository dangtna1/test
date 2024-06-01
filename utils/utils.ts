import { Buffer } from "buffer";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stringToHex(stringToEncode: string) {
  return Buffer.from(stringToEncode).toString("hex");
}

export function isTicketValid(ticket: string) {
  return Buffer.from(ticket).length === 4;
}

export function handleError(e: any) {
  console.error((e && e.message) || e);
}

export function isAddress(address: string) {
  return (
    address.length === 42 || address.length === 62 || address.length === 34
  );
}
