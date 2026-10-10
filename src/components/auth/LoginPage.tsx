import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Role } from '../../types'
import { presentationAccounts, signIn } from '../../lib/sessionStore'
import { t } from '../../lib/language'
import { Icon } from '../Icon'
import { LanguageSelect } from '../LanguageSelect'
import '../../Login.css'

export function LoginPage({ role }: { role: Role }) {
  const mobile = role === 'Farmer'
  const account = presentationAccounts[role]
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [invalidField, setInvalidField] = useState<'identifier' | 'password' | null>(null)
  const identifierRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!mobile) return
    document.body.classList.add('farmer-document')
    return () => document.body.classList.remove('farmer-document')
  }, [mobile])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!identifier.trim()) {
      setError(mobile ? 'Enter your mobile number.' : 'Enter your email address.')
      setInvalidField('identifier'); identifierRef.current?.focus(); return
    }
    if (!password) {
      setError('Enter your password.'); setInvalidField('password'); passwordRef.current?.focus(); return
    }
    const result = signIn(role, identifier, password)
    setError(result); setInvalidField(result ? 'password' : null)
    if (result) passwordRef.current?.focus()
  }
  function fillAccount() {
    setIdentifier(account.identifier); setPassword(account.password)
    setError(''); setInvalidField(null); passwordRef.current?.focus()
  }

  return <div className={`login-page ${mobile ? 'login-mobile' : 'login-web'}`}>
    {!mobile && <section className="login-story" aria-label={t('AgriEquip community')}>
      <img src="/images/farm-banner-v2.jpg" alt="" />
      <div className="login-story-copy"><span className="login-community"><Icon name="pin" size={16} />Nasugbu, Batangas</span>
        <h2>{t('Helping our farming community grow.')}</h2>
        <p>{t('Connect farmers, equipment owners, and cooperatives through better rental management.')}</p>
        <div className="login-story-features"><span><Icon name="rentals" size={18} />{t('Review rental requests')}</span><span><Icon name="equipment" size={18} />{t('Manage equipment and owners')}</span><span><Icon name="check" size={18} />{t('Track pickup and return')}</span></div>
      </div>
    </section>}
    <div className="login-panel">
      <header className="login-header"><div className="login-brand"><span className="brand-mark"><Icon name="leaf" size={22} /></span><div>AgriEquip <span>PH</span><small>{t(mobile ? 'Farmer portal' : 'Admin portal')}</small></div></div><LanguageSelect /></header>
      <main className="login-main" id="login-main">
        {mobile && <div className="login-farm-banner"><img src="/images/farm-banner-v2.jpg" alt="" /><span><Icon name="pin" size={13} />Nasugbu, Batangas</span></div>}
        <div className="login-heading"><p className="login-eyebrow">{t(mobile ? 'YOUR FARMING COMMUNITY' : 'ADMINISTRATION')}</p><h1>{t('Welcome back')}</h1><p>{t(mobile ? 'Sign in to find equipment and manage your rentals.' : 'Sign in to review requests and manage your community.')}</p></div>
        <form className="login-form" onSubmit={submit} noValidate>
          <label htmlFor="login-identifier">{t(mobile ? 'Mobile number' : 'Email address')}</label>
          <input ref={identifierRef} id="login-identifier" name="username" type={mobile ? 'tel' : 'email'} inputMode={mobile ? 'tel' : 'email'} autoComplete="username" placeholder={mobile ? '09123456789' : 'admin@agriequip.ph'} value={identifier} onChange={event => { setIdentifier(event.target.value); setError(''); setInvalidField(null) }} required aria-invalid={invalidField === 'identifier'} aria-describedby={error ? 'login-error' : undefined} />
          <label htmlFor="login-password">{t('Password')}</label>
          <div className="login-password"><input ref={passwordRef} id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => { setPassword(event.target.value); setError(''); setInvalidField(null) }} required aria-invalid={invalidField === 'password'} aria-describedby={error ? 'login-error' : undefined} /><button type="button" aria-label={t(showPassword ? 'Hide password' : 'Show password')} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{t(showPassword ? 'Hide' : 'Show')}</button></div>
          {error && <p className="login-error" id="login-error" role="alert">{t(error)}</p>}
          <button className="button primary full-width login-submit" type="submit">{t(mobile ? 'Sign in as farmer' : 'Sign in as admin')}<Icon name="arrow" size={17} /></button>
        </form>
        <details className="login-account"><summary>{t('Presentation account')}</summary><p>{t('Use this sample account to explore the prototype.')}</p><dl><div><dt>{t(mobile ? 'Mobile number' : 'Email address')}</dt><dd>{account.identifier}</dd></div><div><dt>{t('Password')}</dt><dd>{account.password}</dd></div></dl><button className="button secondary full-width" type="button" onClick={fillAccount}>{t('Fill account details')}</button></details>
        <p className="login-footnote">{t('Prototype sign-in only. No real account is required. Your session and rental records are saved in this browser.')}</p>
      </main>
      <footer className="login-footer">{t('Modernizing fields. Sharing yields.')}</footer>
    </div>
  </div>
}
