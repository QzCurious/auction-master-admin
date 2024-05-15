import { createRole } from "@api/backend/rbac/createRole";
import { deleteRole } from "@api/backend/rbac/deleteRole";
import { roles } from "@api/backend/rbac/roles";
import type {
  BaseRecord,
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
      case "roles":
        const res = await roles();
        return {
          data: res.data.map((role) => ({ id: role.role, ...role })),
          total: res.data.length,
        };
      default:
        throw new Error("Resource not found");
    }
  },
  getOne: function <TData extends BaseRecord = BaseRecord>(
    params: GetOneParams
  ): Promise<GetOneResponse<TData>> {
    throw new Error("Function not implemented.");
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
  update: function <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    params: UpdateParams<TVariables>
  ): Promise<UpdateResponse<TData>> {
    throw new Error("Function not implemented.");
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
