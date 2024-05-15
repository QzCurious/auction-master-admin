import { apiClient } from "@api/client";
import { Permission } from "./permissions";
import { Role } from "./roles";

export type RolesPermissions = Role & {
  permission: Permission[] | null;
};

type ApiData = Array<RolesPermissions>;

type ErrorCode = null;

export async function rolesPermissions() {
  const data = await apiClient<ApiData, ErrorCode>("/roles/permissions", {
    method: "GET",
  });

  //   if (data.error) {
  //     return { data: null, error: data.error };
  //   }

  return { data: data.data, error: null };
}
