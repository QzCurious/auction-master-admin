import { apiClient } from "@api/client";

export type Permission = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  description: string;
};

type ApiData = Array<Permission>;

type ErrorCode = null;

export async function permissions() {
  const data = await apiClient<ApiData, ErrorCode>("/permissions", {
    method: "GET",
  });

  //   if (data.error) {
  //     return { data: null, error: data.error };
  //   }

  return { data: data.data, error: null };
}
