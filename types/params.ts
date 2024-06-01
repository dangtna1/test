export type SearchParams = Record<string, string[] | string | undefined>;

function parseQueryValue(value: any) {
  return Array.isArray(value) ? value[0] : value;
}
function parseQueryValues(value: any) {
  return Array.isArray(value) ? value : [value];
}
export function parseStringParam(paramValue: any, defaultValue: any = void 0) {
  const parsedValue = parseQueryValue(paramValue);
  return parsedValue || defaultValue;
}
function parseNumberParam(paramValue: any, defaultValue: any = void 0) {
  const parsedValue = parseQueryValue(paramValue);
  return Number(parsedValue) || defaultValue;
}
function parseJoinedStringParam(paramValue: any, separator = "|") {
  const parsedValue = parseQueryValue(paramValue);
  return parsedValue?.split(separator) || [];
}
export function parseStringParams(paramValue: any, defaultValue: any = void 0) {
  if (!paramValue || paramValue.length === 0) {
    return defaultValue;
  }
  return parseQueryValues(paramValue);
}
function parseNumberParams(paramValue: any, defaultValue: any = void 0) {
  if (!paramValue) {
    return defaultValue;
  }
  const parsedValue = parseQueryValues(paramValue);
  return parsedValue.map((value) => Number(value));
}
function parseJoinedStringParams(paramValue: any, separator = "|") {
  if (!paramValue) {
    return void 0;
  }
  const parsedValue = parseQueryValues(paramValue);
  return parsedValue.map((value) => value.split(separator));
}
export function parsePaginationParams(
  searchParams: any,
  {
    offsetParam = "offset",
    limitParam = "limit",
    defaultOffset = 0,
    defaultLimit = 10,
  } = {},
) {
  const parsedOffset = Math.max(
    parseNumberParam(searchParams[offsetParam], defaultOffset),
    defaultOffset,
  );
  const parsedLimit = Math.max(
    parseNumberParam(searchParams[limitParam], defaultLimit),
    1,
  );
  return {
    offset: parsedOffset,
    limit: parsedLimit,
  };
}
