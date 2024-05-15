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
  const url = import.meta.env.VITE_API_BASE_URL + input;
  const res = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
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
