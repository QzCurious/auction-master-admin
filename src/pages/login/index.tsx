import { useApiStore } from "@api/apiStore";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AuthPage } from "@refinedev/mui";
import { Controller, useFormContext } from "react-hook-form";

export default function Login() {
  const { remember } = useApiStore();
  console.log({ remember })
  return (
    <AuthPage
      type="login"
      title="Auction Master Admin"
      rememberMe={<RememeberMe />}
      formProps={{
        defaultValues: {
          email: remember,
          rememberMe: !!remember,
        },
      }}
    />
  );
}

const RememeberMe = () => {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      sx={{
        span: {
          fontSize: "12px",
          color: "text.secondary",
        },
      }}
      color="secondary"
      control={
        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <Checkbox
              size="small"
              id="rememberMe"
              {...field}
              checked={field.value}
            />
          )}
        />
      }
      label="Remember me"
    />
  );
};
