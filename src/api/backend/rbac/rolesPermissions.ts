import { apiClient, withAuth } from "@api/apiClient";
import { Permission } from "./permissions";
import { Role } from "./roles";

export type RolesPermissions = Role & {
  permission: Permission[] | null;
};

type Data = Array<RolesPermissions>;

type ErrorCode = never;

export async function rolesPermissions() {
  const res = await withAuth(apiClient)<Data, ErrorCode>("/roles/permissions", {
    method: "GET",
  });

  return res;
}
