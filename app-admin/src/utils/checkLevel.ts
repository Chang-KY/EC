import { UserRole } from '@/types/userRole'

export function canManageAdmins(role: UserRole, level: number) {
  if (role === 'super_admin') return true
  if (role === 'admin' && level >= 5) return true
  return false
}
