import { Permission } from "@api/backend/rbac/permissions";
import { Role } from "@api/backend/rbac/roles";
import { RolesPermissions } from "@api/backend/rbac/rolesPermissions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { HttpError } from "@refinedev/core";
import { Edit, useDataGrid } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";
import { Nullable } from "../../interfaces";

export const RoleEdit = () => {
  const { dataGridProps } = useDataGrid<Role>({
    resource: "permissions",
    pagination: { mode: "off" },
  });
  const {
    saveButtonProps,
    refineCore: { onFinish, queryResult },
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<RolesPermissions, HttpError, Nullable<RolesPermissions>>({
    defaultValues: {
      role: "",
      description: "",
      permission: [],
    },
  });

  const columns = React.useMemo<GridColDef<Permission>[]>(
    () => [
      {
        field: "method",
        headerName: "Method",
        type: "string",
        sortable: false,
      },
      {
        field: "url",
        headerName: "URL",
        type: "string",
        sortable: false,
        minWidth: 360,
      },
      {
        field: "description",
        headerName: "Description",
        sortable: false,
        flex: 1,
      },
    ],
    []
  );

  return (
    <Edit
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit((data) => {
          const addPermissions =
            data.permission?.filter(
              (item) =>
                !queryResult?.data?.data.permission?.some(
                  (i) => i.method === item.method && i.url === item.url
                )
            ) ?? [];
          const removePermissions =
            queryResult?.data?.data.permission?.filter(
              (item) =>
                !data.permission?.some(
                  (i) => i.method === item.method && i.url === item.url
                )
            ) ?? [];
          return onFinish({
            ...data,
            addPermissions,
            removePermissions,
          } as any);
        }),
      }}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              inputProps={{ readOnly: true }}
              margin="normal"
              fullWidth
              label="Role"
              autoFocus
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              inputProps={{ readOnly: true }}
              margin="normal"
              label="Description"
              multiline
              rows={4}
            />
          )}
        />

        <Controller
          name="permission"
          control={control}
          render={({ field }) => {
            return (
              <DataGrid
                {...dataGridProps}
                columns={columns}
                autoHeight
                disableColumnMenu
                checkboxSelection
                pageSizeOptions={[100]}
                rowSelectionModel={
                  field.value?.map((item) => item.method + item.url) ?? []
                }
                onRowSelectionModelChange={(s) => {
                  field.onChange(
                    dataGridProps.rows.filter((r) => s.some((s) => s === r.id))
                  );
                }}
              />
            );
          }}
        />
      </Box>
    </Edit>
  );
};
