import { apiClient, withAuth } from "@api/apiClient";

export type Permission = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  description: string;
};

type Data = Array<Permission>;

type ErrorCode = never;

export async function permissions() {
  const res = await withAuth(apiClient)<Data, ErrorCode>("/permissions", {
    method: "GET",
  });

  return res;
}
