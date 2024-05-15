import { Role } from "@api/backend/rbac/roles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DeleteButton, EditButton, List, useDataGrid } from "@refinedev/mui";
import React from "react";

export const RoleList: React.FC = () => {
  const { dataGridProps } = useDataGrid<Role>({ sorters: { mode: "off" } });

  const columns = React.useMemo<GridColDef<Role>[]>(
    () => [
      {
        field: "role",
        headerName: "Role",
        type: "string",
        sortable: false,
      },
      {
        field: "description",
        headerName: "Description",
        minWidth: 400,
        flex: 1,
        sortable: false,
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return (
            <>
              <DeleteButton hideText recordItemId={row.role} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
        sortable: false,
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        disableColumnMenu
      />
    </List>
  );
};
