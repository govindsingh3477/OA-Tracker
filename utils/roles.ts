import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === role
}
export const isAuthorized = async () => {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role as Roles;
  return role === 'moderator' || role === 'admin';
};