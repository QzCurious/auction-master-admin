import { apiClient } from "@api/apiClient";
import { z } from "zod";
import { throwIfInvalid } from "./helpers";

const ReqSchema = z.object({
  account: z.string(),
  password: z.string(),
});

interface Data {
  token: string;
  refreshToken: string;
}

type ErrorCode =
  // PasswordIncorrect
  | "1004"
  // ConsignorNotExist
  | "1602";

export async function session(formData: FormData) {
  throwIfInvalid(formData, ReqSchema);

  const res = await apiClient<Data, ErrorCode>("/session", {
    method: "POST",
    body: formData,
  });

  return res;
}
