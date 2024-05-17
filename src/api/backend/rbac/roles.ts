import { apiClient, withAuth } from "@api/apiClient";

export type Role = { role: string; description: string };

type Data = Array<Role>;

type ErrorCode = never;

export async function roles() {
  const res = await withAuth(apiClient)<Data, ErrorCode>("/roles", {
    method: "GET",
  });

  return res;
}
