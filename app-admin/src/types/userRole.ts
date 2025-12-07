import { z } from 'zod'

export const userRoleSchema = z.enum(['admin', 'super_admin', 'manager', 'guest'])
export type UserRole = z.infer<typeof userRoleSchema>
