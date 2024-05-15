import { apiClient } from "@api/client";
import { z } from "zod";
import { useApiStore } from "./apiStore";

const ReqSchema = z.object({
  refreshToken: z.string(),
});

type ErrorCode =
  // TokenIncorrect
  "1003";

interface ApiData {
  token: string;
}

export async function sessionRefresh(formData: FormData) {
  const parsed = ReqSchema.safeParse(Object.fromEntries(formData));
  if (parsed.error) {
    const err = parsed.error.flatten();
    return { data: null, error: null, parseError: err };
  }

  const res = await apiClient<ApiData, ErrorCode>("/session/refresh", {
    method: "POST",
    body: formData,
  });

  if (res.error) {
    useApiStore.getState().clearLogin();
    return { data: null, error: res.error, parseError: null };
  }

  useApiStore.getState().renewToken(res.data.token);
  const jwt = useApiStore.getState().jwt;

  return { data: jwt, error: null, parseError: null };
}
