import { apiClient, withAuth } from "@api/apiClient";
import { z } from "zod";
import { throwIfInvalid } from "./helpers";

const ReqSchema = z.object({
  refreshToken: z.string(),
});

interface Data {
  token: string;
}

type ErrorCode =
  // TokenIncorrect
  "1003";

export async function sessionRefresh(formData: FormData) {
  throwIfInvalid(formData, ReqSchema);

  const res = await withAuth(apiClient, { refreshToken: false })<
    Data,
    ErrorCode
  >("/session/refresh", {
    method: "POST",
    body: formData,
  });

  return res;
}
