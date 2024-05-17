import { useApiStore } from "./apiStore";
import { sessionRefresh } from "./session-refresh";

interface OptsGeneric {
  refreshToken?: boolean;
}
export function withAuth<Opts extends OptsGeneric = OptsGeneric>(
  _apiClient: typeof apiClient,
  opts?: Opts
) {
  const middleware = async function <Data, ErrorCode extends string = never>(
    input: string,
    init?: RequestInit
  ): Promise<ApiClientResponse<Data, ErrorCode | "1003">> {
    if (opts?.refreshToken ?? true) {
      const refreshTokenRes = await refreshTokenIfExpired();
      if (refreshTokenRes.status === "FAILED") {
        return {
          data: null,
          status: {
            code: "1003",
            message: "frontend mock error: " + refreshTokenRes.data,
            dateTime: "",
            traceCode: "",
          },
        } as any;
      }
    }

    const token = useApiStore.getState().token;
    return _apiClient(input, {
      ...init,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        ...init?.headers,
      },
    });
  };
  return middleware;
}

export async function apiClient<Data, ErrorCode extends string = never>(
  input: string,
  init?: RequestInit
): Promise<ApiClientResponse<Data, ErrorCode>> {
  const url = import.meta.env.VITE_API_BASE_URL + input;
  const res = await fetch(url, init);

  try {
    const j = await res.json();

    if (import.meta.env.VITE_API_LOG) {
      console.log(`apiClient:`, `[${init?.method ?? "GET"} ${url}]:`);
      console.log(
        `payload:`,
        init?.body instanceof FormData
          ? Object.fromEntries(init.body)
          : init?.body
      );
      console.log(`response:`, j);
    }

    return { ...j, error: !j.data ? j.status.code : null };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to parse response as JSON");
  }
}

type ApiClientResponse<Data, ErrorCode extends string = never> =
  | {
      data: Data;
      error: null;
      status: {
        code: "0";
        message: "Success";
        dateTime: string;
        traceCode: string;
      };
    }
  | (ErrorCode extends string
      ? {
          data: null;
          error: ErrorCode;
          status: {
            code: ErrorCode;
            message: string;
            dateTime: string;
            traceCode: string;
          };
        }
      : never);

let sessionRefreshing: ReturnType<typeof sessionRefresh> | null = null;
export async function refreshTokenIfExpired() {
  const jwt = useApiStore.getState().jwt;
  // no jwt
  if (!jwt) return { status: "FAILED", data: "NO_JWT" } as const;

  // jwt still valid
  if (jwt.exp * 1000 > Date.now() - 30 * 1000) {
    return { status: "OK", data: "NOT_EXPIRED" } as const;
  }

  const refreshToken = useApiStore.getState().refreshToken;
  if (!refreshToken) {
    if (import.meta.env.DEV) {
      console.log("BUG: Token expired without refresh token");
    }
    return { status: "FAILED", data: "NO_REFRESH_TOKEN" } as const;
  }

  if (!sessionRefreshing) {
    const formData = new FormData();
    formData.append("refreshToken", refreshToken);
    sessionRefreshing = sessionRefresh(formData);
  }

  const res = await sessionRefreshing;
  sessionRefreshing = null;

  // refresh token expired
  if (!res.data) {
    useApiStore.getState().clearLogin();
    if (import.meta.env.DEV) {
      console.log("Refresh token expired", res);
    }
    return { status: "FAILED", data: "REFRESH_TOKEN_EXPIRED" } as const;
  }

  useApiStore.getState().setRefreshToken(res.data.token);
  if (import.meta.env.DEV) {
    console.log("Token renewed");
  }
  return { status: "OK", data: "REFRESHED" } as const;
}
