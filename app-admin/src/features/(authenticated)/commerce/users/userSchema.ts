import { z } from 'zod'

const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string().nullable(),

  phone: z.string().nullable(),
  phone_verified: z.boolean().nullable(),

  bio: z.string().nullable(),
  links: z.object().nullable(),
  settings: z.object().nullable(),

  email_verified: z.boolean().nullable(),
})

export const usersUpdateSchema = userSchema.partial()

export type usersUpdateFormValue = z.infer<typeof usersUpdateSchema>
