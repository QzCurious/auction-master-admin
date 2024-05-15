import { apiClient } from "@api/client";

export type Role = { role: string; description: string };

type ApiData = Array<Role>;

type ErrorCode = null;

export async function roles() {
  const data = await apiClient<ApiData, ErrorCode>("/roles", {
    method: "GET",
  });

//   if (data.error) {
//     return { data: null, error: data.error };
//   }

  return { data: data.data, error: null };
}
