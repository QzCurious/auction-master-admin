import { z } from "zod";

export function throwIfInvalid<F extends FormData, Z extends z.ZodType<any>>(
  formData: F,
  schema: Z
) {
  const dataObj = Object.fromEntries(formData);
  const res = schema.safeParse(dataObj);
  if (res.error) {
    if (import.meta.env.DEV) {
      console.log("Invalid form data");
      console.log("dataObj", dataObj);
      console.log(res.error);
    }
    throw new Error("Invalid form data");
  }
  return;
}
