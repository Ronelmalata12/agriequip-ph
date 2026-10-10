import { t } from '../../lib/language'
import { Icon } from '../Icon'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { saveFarmerProfile, useProfileStore } from '../../lib/profileStore'
import { LanguageSelect } from '../LanguageSelect'
import { SignOutButton } from '../auth/SignOutButton'

type ProfileProps = {
  requests: number
  active: number
  previous: number
  onViewRentals: () => void
  onContinueRental?: () => void
}

export function FarmerProfile({ requests, active, previous, onViewRentals, onContinueRental }: ProfileProps) {
  const { data: profile, warning } = useProfileStore()
  const [draft, setDraft] = useState(profile)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = saveFarmerProfile(draft)
    setError(result); setMessage(result ? '' : 'Farmer profile saved. New requests will use these details.')
  }
  return <>
    <div className="farmer-page-title"><p>{t("YOUR FARMING COMMUNITY")}</p><h1>{t("My profile")}</h1><span>{t("Your contact and farm details for rental requests.")}</span></div>
    <section className="farmer-account-card farmer-profile-card" aria-label={t("Farmer profile")}>
      <span className="farmer-profile-avatar" aria-hidden="true">{t("KF")}</span>
      <h2>{profile.name}</h2><p>{t("Farmer profile")}</p>
      <span className="farmer-profile-location"><Icon name="pin" size={16} />{t("Nasugbu, Batangas")}</span>
    </section>
    <form className="rental-form farmer-account-card farmer-profile-form" onSubmit={save} noValidate>
      <h2>{t("Farmer information")}</h2>
      <p className="help-text">{t("Use fictional information for the showcase. Saved in this browser only.")}</p>
      <label>{t("Full name")}<input autoComplete="name" maxLength={100} required value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label>
      <label>{t("Contact number")}<input type="tel" autoComplete="tel" inputMode="tel" placeholder={t("09123456789")} maxLength={20} required value={draft.contact} onChange={e => setDraft({ ...draft, contact: e.target.value })} /></label>
      <label>{t("Barangay")}<input maxLength={100} placeholder={t("e.g. Brgy. Wawa")} required value={draft.barangay} onChange={e => setDraft({ ...draft, barangay: e.target.value })} /></label>
      <label>{t("Farm location")}<textarea aria-label={t("Farm location")} rows={3} maxLength={250} placeholder={t("Farm address or nearby landmark in Nasugbu")} required value={draft.farmLocation} onChange={e => setDraft({ ...draft, farmLocation: e.target.value })} /></label>
      {(error || warning) && <p className="form-error" role="alert">{t(error || warning)}</p>}
      {message && <p className="availability-result" role="status">{t(message)}</p>}
      <button className="button primary full-width" type="submit">{t("Save profile")}<Icon name="check" size={16} /></button>
      {onContinueRental && <button className="button secondary full-width" type="button" onClick={onContinueRental}>{t("Continue rental")}</button>}
    </form>
    <section className="farmer-section" aria-labelledby="profile-rentals-heading">
      <div className="farmer-section-heading"><h2 id="profile-rentals-heading">{t("Your rental overview")}</h2></div>
      <dl className="farmer-profile-stats">
        <div><dt>{t("Requests")}</dt><dd>{requests}</dd></div>
        <div><dt>{t("Active")}</dt><dd>{active}</dd></div>
        <div><dt>{t("Previous")}</dt><dd>{previous}</dd></div>
      </dl>
      <button className="button primary full-width" onClick={onViewRentals}>{t("View my rentals")}<Icon name="arrow" size={17} /></button>
    </section>
    <p className="farmer-footnote">{t("Profile details are saved in this browser. Existing requests retain their submitted information.")}</p>
    <section className="farmer-account-card"><h2>{t('Account')}</h2><p>{t('Signing out keeps your profile and rental records in this browser.')}</p><SignOutButton role="Farmer" /></section>
  </>
}

export function FarmerSettings() {
  return <>
    <div className="farmer-page-title"><p>{t("HELP & APP INFORMATION")}</p><h1>{t("Settings")}</h1><span>{t("Your app information and rental guide.")}</span></div>
    <section className="farmer-account-card"><LanguageSelect /></section>
    <section className="farmer-account-card" aria-labelledby="settings-demo-heading">
      <h2 id="settings-demo-heading">{t("About this prototype")}</h2>
      <dl className="farmer-account-details">
        <div><dt>{t("Current role")}</dt><dd>{t("Farmer")}</dd></div>
        <div><dt>{t("Community")}</dt><dd>{t("Nasugbu, Batangas")}</dd></div>
        <div><dt>{t("Rental storage")}</dt><dd>{t("This browser only")}</dd></div>
      </dl>
      <p>{t("Web and Mobile views share rental records in this browser. Refreshing keeps your requests; another browser has its own data.")}</p>
    </section>
    <details className="farmer-account-card farmer-help-details">
      <summary>{t("How to rent equipment")}</summary>
      <ol><li>{t("Browse equipment and check the details.")}</li><li>{t("Choose dates and pickup, then review the estimate.")}</li><li>{t("Submit your request and wait for admin approval.")}</li><li>{t("Confirm the booking in My Rentals.")}</li><li>{t("The admin records pickup and return.")}</li></ol>
    </details>
    <section className="farmer-account-card" aria-labelledby="settings-showcase-heading">
      <h2 id="settings-showcase-heading">{t("For your presentation")}</h2>
      <p>{t("Use Web → Rental Requests to approve requests as an admin. Return to Mobile to confirm a booking.")}</p>
      <p>{t("Listings, prices, and availability are fictional. Real account verification, payments, email, SMS, and push notifications are not connected.")}</p>
    </section>
  </>
}
