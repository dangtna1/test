import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";
import isObject from "lodash/isObject";
import isEmpty from "lodash/isEmpty";

export function sanitizeData<T>(input: T): T {
  let result;

  if (Array.isArray(input)) {
    result = input.map((item) => sanitizeData(item as object));
  } else {
    result = omitBy(
      input as object,
      (value) => isNil(value) || (isObject(value) && isEmpty(value)),
    ) as T;
  }

  return result as T;
}
