import type { ReactNode } from 'react'
import type { Role } from '../../types'
import { useSession } from '../../lib/sessionStore'
import { LoginPage } from './LoginPage'

export function AuthGate({ role, children }: { role: Role; children: ReactNode }) {
  const { data: session } = useSession(role)
  return session ? children : <LoginPage role={role} />
}
