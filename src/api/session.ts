import { apiClient } from "@api/client";
import { z } from "zod";
import { useApiStore } from "./apiStore";

const ReqSchema = z.object({
  account: z.string(),
  password: z.string(),
});

type ErrorCode =
  // PasswordIncorrect
  | "1004"
  // ConsignorNotExist
  | "1602";

interface ApiData {
  token: string;
  refreshToken: string;
}

export async function session(formData: FormData) {
  const parsed = ReqSchema.safeParse(Object.fromEntries(formData));
  if (parsed.error) {
    const err = parsed.error.flatten();
    return { data: null, error: null, parseError: err };
  }

  const res = await apiClient<ApiData, ErrorCode>("/session", {
    method: "POST",
    body: formData,
  });

  if (res.error) {
    return { data: null, error: res.error, parseError: null };
  }

  useApiStore.getState().setLogin(res.data.token, res.data.refreshToken);
  const jwt = useApiStore.getState().jwt;

  return { data: jwt, error: null, parseError: null };
}
