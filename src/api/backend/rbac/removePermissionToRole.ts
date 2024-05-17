import { apiClient, withAuth } from "@api/apiClient";
import { throwIfInvalid } from "@api/helpers";
import { z } from "zod";

export type Role = { role: string; description: string };

type Data = "Success";

type ErrorCode = never;

const ReqSchema = z.object({
  role: z.string(),
  url: z.string(),
  method: z.string(),
});
export async function removePermissionToRole(formData: FormData) {
  throwIfInvalid(formData, ReqSchema);

  const query = new URLSearchParams(formData as any);
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/permissions?${query}`,
    {
      method: "DELETE",
    }
  );

  return res;
}
