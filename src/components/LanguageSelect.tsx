import { useState } from 'react'
import { setLanguage, t, useLanguage } from '../lib/language'
import type { Language } from '../lib/language'

export function LanguageSelect() {
  const { data: language, warning } = useLanguage()
  const [error, setError] = useState('')
  return <div className="language-control"><label>{t('Language')}<select aria-label={t('App language')} value={language} onChange={event => setError(setLanguage(event.target.value as Language))}><option value="en">English</option><option value="fil">Filipino</option></select></label>{(error || warning) && <p className="form-error" role="alert">{t(error || warning)}</p>}</div>
}
