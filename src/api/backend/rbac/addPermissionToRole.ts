import { apiClient } from "@api/client";
import { z } from "zod";

export type Role = { role: string; description: string };

type ApiData = "Success";

type ErrorCode = null;

const CreateRoleReqSchema = z.object({
  role: z.string(),
  url: z.string(),
  method: z.string(),
});
export async function addPermissionToRole(formData: FormData) {
  const parsed = CreateRoleReqSchema.safeParse(Object.fromEntries(formData));
  if (parsed.error) {
    const err = parsed.error.flatten();
    return { data: null, error: null, parseError: err };
  }

  const data = await apiClient<ApiData, ErrorCode>("/permissions", {
    method: "POST",
    body: formData,
  });

  // if (data.error) {
  //   return { data: null, error: data.error };
  // }

  return { data: data.data, error: null };
}
