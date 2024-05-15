import { addPermissionToRole } from "@api/backend/rbac/addPermissionToRole";
import { createRole } from "@api/backend/rbac/createRole";
import { deleteRole } from "@api/backend/rbac/deleteRole";
import { Permission, permissions } from "@api/backend/rbac/permissions";
import { removePermissionToRole } from "@api/backend/rbac/removePermissionToRole";
import { roles } from "@api/backend/rbac/roles";
import { rolesPermissions } from "@api/backend/rbac/rolesPermissions";
import type {
  CreateParams,
  CreateResponse,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  HttpError,
  UpdateParams,
  UpdateResponse,
} from "@refinedev/core";

export const dataProvider: DataProvider = {
  getList: async function ({
    resource,
    dataProviderName,
    filters,
    meta,
    pagination,
    sorters,
  }: GetListParams): Promise<GetListResponse<any>> {
    switch (resource) {
      case "roles": {
        const res = await roles();
        return {
          data: res.data.map((role) => ({ id: role.role, ...role })),
          total: res.data.length,
        };
      }
      case "permissions": {
        const res = await permissions();
        return {
          data: res.data.map((permission) => ({
            id: permission.method + permission.url,
            ...permission,
          })),
          total: res.data.length,
        };
      }
      default:
        throw new Error("Resource not found");
    }
  },
  getOne: async function ({
    resource,
    id,
  }: GetOneParams): Promise<GetOneResponse<any>> {
    switch (resource) {
      case "roles":
        const res = await rolesPermissions();
        const one = res.data.find((d) => d.role === id.toString());
        if (!one) {
          throw { statusCode: 404 } as HttpError;
        }
        return { data: one };
      default:
        throw new Error("Resource not found");
    }
  },
  create: async function ({
    resource,
    variables,
  }: CreateParams<any>): Promise<CreateResponse<any>> {
    switch (resource) {
      case "roles":
        const formData = new FormData();
        formData.append("role", variables.role);
        formData.append("description", variables.description);
        const res = await createRole(formData);
        if (res.error) {
          throw {
            message: "Something went wrong",
            statusCode: 500,
          } as HttpError;
        }
        return { data: null };
      default:
        throw new Error("Resource not found");
    }
  },
  update: async function ({
    resource,
    variables,
  }: UpdateParams<any>): Promise<UpdateResponse<any>> {
    switch (resource) {
      case "roles": {
        const addPermissions = variables.addPermissions as Permission[];
        const removePermissions = variables.removePermissions as Permission[];
        await Promise.all([
          ...addPermissions.map((p) => {
            const formData = new FormData();
            formData.append("role", variables.role);
            formData.append("method", p.method);
            formData.append("url", p.url);
            return addPermissionToRole(formData);
          }),
          ...removePermissions.map((p) => {
            const formData = new FormData();
            formData.append("role", variables.role);
            formData.append("method", p.method);
            formData.append("url", p.url);
            return removePermissionToRole(formData);
          }),
        ]);
        return { data: null };
      }
      default:
        throw new Error("Resource not found");
    }
  },
  deleteOne: async function ({
    resource,
    id,
  }: DeleteOneParams<any>): Promise<DeleteOneResponse<any>> {
    switch (resource) {
      case "roles":
        const res = await deleteRole(id.toString());
        if (res.error) {
          throw {
            message: "Something went wrong",
            statusCode: 500,
          } as HttpError;
        }
        return { data: null };
      default:
        throw new Error("Resource not found");
    }
  },
  getApiUrl: function (): string {
    throw new Error("Function not implemented.");
  },
};
