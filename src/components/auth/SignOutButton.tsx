import { useState } from 'react'
import type { Role } from '../../types'
import { signOut } from '../../lib/sessionStore'
import { t } from '../../lib/language'

export function SignOutButton({ role }: { role: Role }) {
  const [error, setError] = useState('')
  return <div className="sign-out-control">
    <button className="button secondary small" onClick={() => setError(signOut(role))}>{t('Sign out')}</button>
    {error && <p className="form-error" role="alert">{t(error)}</p>}
  </div>
}
