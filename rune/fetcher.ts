import type {
  ErrorData,
  ErrorResponse,
  RuneResponse,
} from "@/lib/rune/definitions";
import { DataType } from "@/lib/rune/definitions";
import { baseUrl } from "@/lib/rune/endpoint";
import { auth } from "@/auth";

export async function runeFetch<T, E = ErrorResponse<ErrorData>>(
  path: string | URL,
  init?: RequestInit,
  type: DataType = DataType.JSON,
  overrideBaseUrl?: string,
): Promise<RuneResponse<T, E>> {
  try {
    const session = await auth();
    // @ts-ignore
    const authorization = session?.accessToken
      ? // @ts-expect-error -- property does not exist on type
        `Bearer ${session.accessToken}`
      : "";

    const headers: HeadersInit = {
      Authorization: authorization,
      "Content-Type": "application/json",
      ...init?.headers,
    };

    if (
      type === DataType.File &&
      !Array.isArray(headers) &&
      !(headers instanceof Headers)
    ) {
      delete headers["Content-Type"];
    }

    const officialBaseUrl = overrideBaseUrl || baseUrl;

    const result = await fetch(new URL(path, officialBaseUrl), {
      ...init,
      headers,
    });

    if (result.status === 204) {
      return {
        body: {} as T,
        ok: true,
        status: result.status,
      };
    }

    const body = (await result.json()) as T;

    if (!result.ok) {
      return {
        body: body as unknown as E,
        ok: result.ok,
        status: result.status,
      };
    }

    return {
      body,
      ok: result.ok,
      status: result.status,
    };
  } catch (error) {
    return {
      body: { error: { message: (error as Error).message } } as E,
      ok: false,
      status: 500,
    };
  }
}
