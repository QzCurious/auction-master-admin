import { apiClient } from "@api/client";
import { z } from "zod";

export type Role = { role: string; description: string };

type ApiData = "Success";

type ErrorCode = null;

export async function deleteRole(role: string) {
  const data = await apiClient<ApiData, ErrorCode>(`/roles/${role}`, {
    method: "DELETE",
  });

  // if (data.error) {
  //   return { data: null, error: data.error };
  // }

  return { data: data.data, error: null };
}
