import { List, useDataGrid } from "@refinedev/mui";
import React from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { Permission } from "@api/backend/rbac/permissions";

export const PermissionList: React.FC = () => {
  const { dataGridProps } = useDataGrid<Permission>();

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
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
