import { HttpError } from "@refinedev/core";
import { useApiStore } from "./apiStore";
import { sessionRefresh } from "./session-refresh";

export async function apiClient<Data, ErrorCode extends string | null = null>(
  input: string,
  init?: RequestInit | undefined
): Promise<
  | {
      data: Data;
      error: null;
      status: ApiStatus<ErrorCode>;
    }
  | (ErrorCode extends string
      ? {
          data: null;
          error: Exclude<ApiStatus<ErrorCode>, { code: "0" }>;
          status: ApiStatus<ErrorCode>;
        }
      : never)
> {
  renewTokenIfExpired();
  const token = useApiStore.getState().token;
  const url = import.meta.env.VITE_API_BASE_URL + input;
  const res = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  try {
    const j: ApiResponse<Data, ErrorCode> = await res.json();

    if (import.meta.env.DEV) {
      console.log(`apiClient:`, `[${init?.method ?? "GET"} ${url}]:`);
      console.log(
        `payload:`,
        init?.body instanceof FormData
          ? Object.fromEntries(init.body)
          : init?.body
      );
      console.log(`response:`, j);
    }

    // admin token error
    if (j.status.code === "1003") {
      renewTokenIfExpired();
      if (!useApiStore.getState().jwt) {
        throw { statusCode: 401 } as HttpError;
      } else {
        return apiClient(input, init);
      }
    }

    if (j.status.code !== "0") {
      return {
        data: null,
        error: j.status,
        status: j.status,
      } as any;
    }

    return { data: j.data!, error: null, status: j.status };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to parse response as JSON");
  }
}

export type ApiStatus<ErrorCode extends string | null = null> = (
  | { code: "0"; message: "Success" }
  | (ErrorCode extends string ? { code: ErrorCode; message: string } : never)
) & {
  dateTime: string;
  traceCode: string;
};

export type ApiResponse<Data, ErrorCode extends string | null> = {
  data: Data | null;
  status: ApiStatus<ErrorCode>;
};

let isRenewing = false;
export async function renewTokenIfExpired() {
  if (isRenewing) return;
  const jwt = useApiStore.getState().jwt;
  if (!jwt) return;
  const refreshToken = useApiStore.getState().refreshToken;
  if (jwt.exp * 1000 < Date.now() && refreshToken) {
    const formData = new FormData();
    formData.append("refreshToken", refreshToken);
    await sessionRefresh(formData);
  }
}
