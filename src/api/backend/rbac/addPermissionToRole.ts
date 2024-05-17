import { apiClient, withAuth } from "@api/apiClient";
import { throwIfInvalid } from "@api/helpers";
import { z } from "zod";

const ReqSchema = z.object({
  role: z.string(),
  url: z.string(),
  method: z.string(),
});

export type Role = { role: string; description: string };

type Data = "Success";

type ErrorCode = never;

export async function addPermissionToRole(formData: FormData) {
  throwIfInvalid(formData, ReqSchema);

  const res = await withAuth(apiClient)<Data, ErrorCode>("/permissions", {
    method: "POST",
    body: formData,
  });

  return res;
}
