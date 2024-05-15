import { z } from 'zod'
import { apiClient } from '@api/client'

const ReqSchema = z
  .object({
    account: z.string(),
    password: z.string(),
    conformPassword: z.string(),
    nickname: z.string(),
  })
  .refine((data) => data.password === data.conformPassword, {
    message: 'Passwords do not match',
    path: ['conformPassword'],
  })

type ApiData = 'Success'

type ErrorCode =
  // ConsignorExisted
  '1601'

export async function consignor(formData: FormData) {
  const parsed = ReqSchema.safeParse(Object.fromEntries(formData))
  if (parsed.error) {
    const err = parsed.error.flatten()
    return { data: null, error: null, parseError: err }
  }

  const data = await apiClient<ApiData, ErrorCode>('/consignor', {
    method: 'POST',
    body: formData,
  })

  if (data.error) {
    return { data: null, error: data.error, parseError: null }
  }

  return { data: data.data, error: null }
}
