import { t } from '../lib/language'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import '../Presentation.css'

export function Presentation({ children }: { children: ReactNode }) {
  const [view, setView] = useState<'web' | 'mobile'>(() => new URLSearchParams(window.location.search).get('view') === 'mobile' ? 'mobile' : 'web')
  function switchView(next: 'web' | 'mobile') {
    setView(next)
    const url = new URL(window.location.href)
    url.searchParams.set('view', next)
    window.history.replaceState(null, '', url)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  return <>
    <header className={`presentation-bar ${view === 'mobile' ? 'mobile-mode' : ''}`}>
      {view === 'web' && <div className="presentation-brand"><Icon name="leaf" size={23} /><strong>{t("AgriEquip PH")}</strong><span>{t("Prototype showcase")}</span></div>}
      <div className="view-switch" role="group" aria-label={t("Prototype view")}><button aria-label={t("Web view")} aria-pressed={view === 'web'} className={view === 'web' ? 'active' : ''} onClick={() => switchView('web')}><Icon name="monitor" size={17} />{t("Web")}</button><button aria-label={t("Mobile view")} aria-pressed={view === 'mobile'} className={view === 'mobile' ? 'active' : ''} onClick={() => switchView('mobile')}><Icon name="phone" size={17} />{t("Mobile")}</button></div>
    </header>
    <div className="web-view" hidden={view !== 'web'}>{children}</div>
    <section className="mobile-showcase" hidden={view !== 'mobile'} aria-label={t("Farmer mobile showcase")}>
      <div className="phone-column">
        <div className="phone-frame">
          <span className="phone-mute-button" aria-hidden="true" />
          <span className="phone-volume-buttons" aria-hidden="true" />
          <span className="phone-power-button" aria-hidden="true" />
          <div className="phone-screen">
            <div className="iphone-status-bar" aria-hidden="true">
              <span className="iphone-time">{t("9:41")}</span>
              <svg className="iphone-indicators" viewBox="0 0 62 16" fill="currentColor">
                <rect x="1" y="10" width="3" height="4" rx=".6" /><rect x="6" y="7" width="3" height="7" rx=".6" /><rect x="11" y="4" width="3" height="10" rx=".6" /><rect x="16" y="1" width="3" height="13" rx=".6" />
                <path d="M23 5a12 12 0 0 1 16 0l-2 2a9 9 0 0 0-12 0zm3 4a7 7 0 0 1 10 0l-2 2a4 4 0 0 0-6 0zm3 4a3 3 0 0 1 4 0l-2 2z" />
                <rect x="43" y="3" width="16" height="10" rx="2" fill="none" stroke="currentColor" /><rect x="45" y="5" width="12" height="6" rx="1" /><rect x="60" y="6" width="2" height="4" rx="1" />
              </svg>
            </div>
            <iframe src={`${window.location.pathname}?preview=farmer`} title={t("AgriEquip farmer mobile prototype")} />
            <div className="iphone-home-area" aria-hidden="true"><span /></div>
          </div>
        </div>
      </div>
    </section>
  </>
}
