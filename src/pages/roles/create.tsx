import { Role } from "@api/backend/rbac/roles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Nullable } from "../../interfaces";

export const RoleCreate = () => {
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm<Role, HttpError, Nullable<Role>>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("role", {
            required: "This field is required",
          })}
          error={!!errors.role}
          helperText={errors.role?.message}
          margin="normal"
          fullWidth
          label="Role"
          name="role"
          autoFocus
        />
        <TextField
          {...register("description", {
            required: "This field is required",
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
          margin="normal"
          label="Description"
          multiline
          rows={4}
        />
      </Box>
    </Create>
  );
};
