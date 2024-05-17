import { apiClient, withAuth } from "@api/apiClient";
import { throwIfInvalid } from "@api/helpers";
import { z } from "zod";

const ReqSchema = z.object({
  role: z.string(),
  description: z.string(),
});

export type Role = { role: string; description: string };

type Data = "Success";

type ErrorCode = never;

export async function createRole(formData: FormData) {
  throwIfInvalid(formData, ReqSchema);

  const res = await withAuth(apiClient)<Data, ErrorCode>("/roles", {
    method: "POST",
    body: formData,
  });

  return res;
}
