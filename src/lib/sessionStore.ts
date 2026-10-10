import { createBrowserStore } from './browserStore'
import type { Role } from '../types'

// Presentation accounts only. Real authentication must be handled by a server.
export const presentationAccounts = {
  Admin: { identifier: 'admin@agriequip.ph', password: 'Admin123!' },
  Farmer: { identifier: '09123456789', password: 'Farmer123!' },
} satisfies Record<Role, { identifier: string; password: string }>

type Session = { role: Role; signedInAt: string } | null
function makeSessionStore(role: Role) {
  return createBrowserStore<Session>(`agriequip-ph.session.${role.toLowerCase()}.v1`, null,
    (value): value is Session => value === null || (typeof value === 'object' && value !== null
      && 'role' in value && value.role === role && 'signedInAt' in value && typeof value.signedInAt === 'string'))
}
const stores = { Admin: makeSessionStore('Admin'), Farmer: makeSessionStore('Farmer') }
export function useSession(role: Role) { return stores[role].useStore() }
export function signIn(role: Role, identifier: string, password: string) {
  const account = presentationAccounts[role]
  const normalized = role === 'Admin' ? identifier.trim().toLowerCase() : identifier.replace(/[\s-]/g, '')
  if (normalized !== account.identifier || password !== account.password) return 'The account details do not match. Use the presentation account below.'
  const error = stores[role].save({ role, signedInAt: new Date().toISOString() })
  return error ? 'Sign-in could not be saved. Please allow browser storage and try again.' : ''
}
export function signOut(role: Role) {
  const error = stores[role].save(null)
  return error ? 'Sign-out could not be saved. Please allow browser storage and try again.' : ''
}
