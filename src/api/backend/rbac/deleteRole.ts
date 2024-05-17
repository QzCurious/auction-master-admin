import { apiClient, withAuth } from "@api/apiClient";

export type Role = { role: string; description: string };

type Data = "Success";

type ErrorCode = never;

export async function deleteRole(role: string) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(`/roles/${role}`, {
    method: "DELETE",
  });

  return res;
}
