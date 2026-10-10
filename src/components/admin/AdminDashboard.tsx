import { t, timestampLabel } from '../../lib/language'
import { useEffect, useState } from 'react'
import type { Page, Rental, RentalStatus, TransitionDetails } from '../../types'
import { equipmentForRental, useEquipmentStore } from '../../lib/equipmentStore'
import { dateLabel, money, rentalDays, today } from '../../lib/rentals'
import { useRentalStore, setDemoRentals } from '../../lib/rentalStore'
import { transitionRental } from '../../lib/workflow'
import { Icon } from '../Icon'
import type { IconName } from '../Icon'
import { Modal } from '../Modal'
import { StatusBadge } from '../RentalList'
import { AdminRentalTable } from './AdminRentalTable'
import { EquipmentPhoto } from '../EquipmentPhoto'
import { EquipmentManagement } from './EquipmentManagement'
import { RentalContactDetails } from '../RentalContactDetails'
import { OwnerRecords } from './OwnerRecords'
import { RentalActions } from './RentalActions'
import { RentalHistory } from '../RentalHistory'
import { NotificationList } from '../NotificationList'
import { LanguageSelect } from '../LanguageSelect'
import { SignOutButton } from '../auth/SignOutButton'
import { useNotifications } from '../../lib/notifications'
import { useOwnerStore } from '../../lib/ownerStore'
import '../../Admin.css'

const navigation: { page: Page; icon: IconName }[] = [
  { page: 'Dashboard', icon: 'dashboard' },
  { page: 'Rental Requests', icon: 'rentals' },
  { page: 'Transactions', icon: 'calendar' },
  { page: 'Equipment Management', icon: 'equipment' },
  { page: 'Owners & Cooperatives', icon: 'owner' },
  { page: 'Notifications', icon: 'bell' },
]
const requestStatuses: ('All' | RentalStatus)[] = ['All', 'Pending', 'Approved', 'Confirmed', 'Active', 'Completed', 'Rejected', 'Cancelled']
const transactionStatuses: ('All' | RentalStatus)[] = ['All', 'Confirmed', 'Active', 'Completed', 'Cancelled']

export function AdminDashboard() {
  const { rentals, warning } = useRentalStore()
  const { unread } = useNotifications(rentals, 'Admin')
  useOwnerStore()
  const { data: equipment } = useEquipmentStore()
  const [page, setPage] = useState<Page>('Dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'All' | RentalStatus>('All')
  const [selectedId, setSelectedId] = useState('')
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null)
  const selected = rentals.find((r) => r.id === selectedId)
  const item = selected ? equipmentForRental(selected, equipment) : undefined
  const count = (next: RentalStatus) => rentals.filter((r) => r.status === next).length
  const transactions = rentals.filter((r) => ['Confirmed', 'Active', 'Completed', 'Cancelled'].includes(r.status))
  const completedEstimate = rentals.filter((r) => r.status === 'Completed').reduce((total, r) => total + r.total, 0)
  const source = page === 'Transactions' ? transactions : rentals
  const visible = source.filter((r) => {
    const listing = equipmentForRental(r, equipment)
    return (status === 'All' || r.status === status)
      && `${r.id} ${listing.name} ${listing.owner} ${r.farmer?.name || 'Ka-Farmer'} ${r.farmer?.contact || ''} ${r.status}`.toLowerCase().includes(search.trim().toLowerCase())
  })

  function navigate(next: Page) {
    setPage(next); setMenuOpen(false); setSearch(''); setStatus('All'); setNotice(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  function reviewRequest(id: string) { setSelectedId(id); setNotice(null) }
  useEffect(() => { if (selectedId && notice?.error) document.querySelector('.modal [role="alert"]')?.scrollIntoView({ block: 'center' }) }, [selectedId, notice])
  function update(rental: Rental, next: RentalStatus, details: TransitionDetails = {}) {
    const result = transitionRental(rentals, rental.id, next, 'Admin', details)
    if (result.error) { setNotice({ message: result.error, error: true }); return }
    setDemoRentals(result.rentals)
    setNotice({ message: `Request ${rental.id.slice(-8).toUpperCase()} is now ${next.toLowerCase()}. The farmer mobile module updates automatically.`, error: false })
  }

  return <div className="app-shell admin-workspace">
    <a className="skip-link" href="#main-content">{t("Skip to admin content")}</a>
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`} id="admin-navigation">
      <a href="#" className="brand" onClick={(event) => { event.preventDefault(); navigate('Dashboard') }}><span className="brand-mark"><Icon name="leaf" size={26} /></span><span>{t("AgriEquip")}<span className="brand-ph">{t(" PH")}</span><small>{t("Admin workspace")}</small></span></a>
      <p className="nav-label">{t("ADMINISTRATION")}</p>
      <nav aria-label={t("Admin navigation")}>{navigation.map((entry) => <button className={`nav-item ${page === entry.page ? 'selected' : ''}`} key={entry.page} aria-current={page === entry.page ? 'page' : undefined} onClick={() => navigate(entry.page)}><Icon name={entry.icon} /><span>{t(entry.page)}</span>{entry.page === 'Rental Requests' && count('Pending') > 0 && <span className="nav-count" aria-label={t(`${count('Pending')} pending`)}>{count('Pending')}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="community-card"><h3>{t("Keep rentals moving.")}</h3><p>{t("Review mobile requests and track pickup, return, and completion.")}</p><span className="community-location"><Icon name="pin" size={14} />{t("Nasugbu, Batangas")}</span></div><p className="sidebar-footer">{t("AgriEquip PH · Admin")}</p></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label={t(menuOpen ? 'Close admin navigation' : 'Open admin navigation')} aria-controls="admin-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button><span className="breadcrumb">{t("Administration")}<Icon name="chevron" size={14} /><strong>{page}</strong></span></div><div className="topbar-right"><LanguageSelect /><button className="icon-button notification-bell" aria-label={t("Open notifications")} onClick={() => navigate('Notifications')}><Icon name="bell" />{unread > 0 && <span className="unread-count">{Math.min(unread, 99)}</span>}</button><span className="topbar-location"><Icon name="pin" size={16} />{t("Nasugbu, Batangas")}</span><span className="admin-role-badge">{t("Admin")}</span><SignOutButton role="Admin" /></div></header>
      <main id="main-content" tabIndex={-1}>
        <div className="demo-note"><p>{t("Admin management of farmer mobile requests. Data is shared within this browser only. All amounts are estimates; no payments are collected.")}</p></div>
        {warning && <p className="notice warning" role="alert">{t(warning)}</p>}
        {notice && <div className={`notice ${notice.error ? 'warning' : ''}`} role={notice.error ? 'alert' : 'status'}><Icon name={notice.error ? 'clock' : 'check'} /><p>{t(notice.message)}</p><button className="icon-button" aria-label={t("Dismiss admin message")} onClick={() => setNotice(null)}><Icon name="close" size={18} /></button></div>}
        {page === 'Owners & Cooperatives' ? <OwnerRecords /> : page === 'Notifications' ? <NotificationList rentals={rentals} role="Admin" onView={reviewRequest} /> : page === 'Equipment Management' ? <EquipmentManagement /> : page === 'Dashboard' ? <>
          <div className="page-heading"><div><p className="eyebrow">{t("NASUGBU OPERATIONS")}</p><h1>{t("Admin dashboard")}</h1><p>{t("Review requests from farmers and monitor each rental through return.")}</p></div><span className="heading-date"><Icon name="calendar" size={17} />{dateLabel(today())}</span></div>
          <section className="stat-grid" aria-label={t("Admin rental summary")}>{[
            { label: 'Pending requests', value: count('Pending'), icon: 'clock' as IconName, detail: 'Ready for admin review' },
            { label: 'Awaiting confirmation', value: count('Approved'), icon: 'rentals' as IconName, detail: 'Farmer confirms on Mobile' },
            { label: 'Ready for pickup', value: count('Confirmed'), icon: 'calendar' as IconName, detail: 'Farmer confirmed the booking' },
            { label: 'Active rentals', value: count('Active'), icon: 'equipment' as IconName, detail: 'Equipment currently in use' },
          ].map((stat) => <article className="stat-card" key={stat.label}><div className="stat-top"><p>{t(stat.label)}</p><span className="stat-icon"><Icon name={stat.icon} /></span></div><strong>{stat.value.toString().padStart(2, '0')}</strong><p className="stat-detail">{t(stat.detail)}</p></article>)}</section>
          <section className="admin-operations-banner"><div><p className="eyebrow">{t("REQUESTS START ON MOBILE")}</p><h2>{t("One connected rental workflow")}</h2><p>{t("Review a request, approve or reject it, then record pickup and return after the farmer confirms.")}</p></div><button className="button primary" onClick={() => navigate('Rental Requests')}>{t("Review requests")}<Icon name="arrow" size={18} /></button></section>
          <section className="panel admin-records-panel"><div className="section-heading"><div><h2>{t("Recent rental requests")}</h2><p>{t("Submitted through the farmer mobile module.")}</p></div><button className="text-button" onClick={() => navigate('Rental Requests')}>{t("View all requests")}<Icon name="arrow" size={16} /></button></div><AdminRentalTable rentals={rentals.slice(0, 5)} onView={reviewRequest} /></section>
          <div className="admin-summary-grid"><section className="panel"><p className="eyebrow">{t("COMPLETED RENTALS")}</p><h2>{count('Completed')}{t(" completed")}</h2><p>{t("Equipment returned and rental records closed.")}</p></section><section className="panel"><p className="eyebrow">{t("COMPLETED RENTAL ESTIMATES")}</p><h2>{money(completedEstimate)}</h2><p>{t("Estimated value of completed rentals. This is not recorded payment or revenue.")}</p></section></div>
        </> : <>
          <div className="page-heading"><div><p className="eyebrow">{page === 'Transactions' ? t('RENTAL FULFILLMENT RECORDS') : t('FARMER MOBILE REQUESTS')}</p><h1>{page === 'Transactions' ? t('Transactions') : t('Rental requests')}</h1><p>{page === 'Transactions' ? t('Monitor confirmed bookings, active rentals, completed returns, and cancellations.') : t('Review incoming requests and manage their approval and rental progress.')}</p></div><span className="count-pill">{source.length}{t(" records")}</span></div>
          {page === 'Transactions' && <p className="admin-info-note">{t("These are rental records and estimates, not payment transactions. No money is collected or marked as paid in this prototype.")}</p>}
          <div className="admin-record-filters"><label className="search-field"><Icon name="search" /><span className="sr-only">{t("Search rental records")}</span><input type="search" aria-label={t("Search rental records")} placeholder={t("Search reference, equipment, farmer, or owner…")} value={search} onChange={(event) => setSearch(event.target.value)} /></label><label className="rental-filter">{t("Status")}<select aria-label={t("Admin status filter")} value={status} onChange={(event) => setStatus(event.target.value as 'All' | RentalStatus)}>{(page === 'Transactions' ? transactionStatuses : requestStatuses).map((value) => <option value={value} key={value}>{t(value)}</option>)}</select></label></div>
          <p className="result-count" role="status">{t("Showing ")}{visible.length}{t(" of ")}{source.length}{t(" records")}</p>
          <section className="panel admin-records-panel"><AdminRentalTable rentals={visible} onView={reviewRequest} /></section>
        </>}
        <footer className="main-footer"><span><Icon name="leaf" size={15} />{t("AgriEquip PH · Admin workspace")}</span><span>{t("Farmer Mobile → Admin Web · Single-browser simulation")}</span></footer>
      </main>
    </div>
    {selected && item && <Modal title={t("Review rental request")} onClose={() => setSelectedId('')}>
      <div className="admin-detail-title"><div><p className="eyebrow">{t("REQUEST ")}{selected.id.slice(-8).toUpperCase()}</p><h2>{item.name}</h2></div><StatusBadge status={selected.status} /></div>
      {notice && <p className={notice.error ? 'form-error' : 'review-note'} role={notice.error ? 'alert' : 'status'}>{t(notice.message)}</p>}
      <section className="admin-equipment-overview" aria-label={t("Rented equipment details")}>
        <figure><div className="admin-equipment-preview"><EquipmentPhoto item={item} /></div><figcaption>{item.photo ? t('Uploaded equipment photo') : t('Equipment image')}</figcaption></figure>
        <div><p className="eyebrow">{t(item.category)}</p><h3>{t("About this equipment")}</h3><p>{item.description}</p><p className="admin-equipment-location"><Icon name="pin" size={15} />{item.location}</p></div>
      </section>
      <RentalContactDetails {...selected} />
      <dl className="booking-summary"><div><dt>{t("Request source")}</dt><dd>{t("Farmer mobile module")}</dd></div><div><dt>{t("Equipment owner")}</dt><dd>{item.owner}</dd></div><div><dt>{t("Rental dates & duration")}</dt><dd>{dateLabel(selected.startDate)}{t(" — ")}{dateLabel(selected.endDate)}{t(" · ")}{rentalDays(selected.startDate, selected.endDate)}{t(" calendar day(s)")}</dd></div><div><dt>{t("Pickup method / equipment location")}</dt><dd>{t(selected.pickup)}{t(" · ")}{item.location}</dd></div><div><dt>{t("Submitted")}</dt><dd>{timestampLabel(selected.createdAt)}</dd></div></dl>
      <div className="estimate"><h3>{t("Rental estimate")}<span>{t("Estimated prices")}</span></h3><div><span>{money(selected.dailyRate)}{t(" × ")}{rentalDays(selected.startDate, selected.endDate)}{t(" day(s)")}</span><strong>{money(selected.dailyRate * rentalDays(selected.startDate, selected.endDate))}</strong></div><div><span>{t("Delivery fee")}</span><strong>{money(selected.deliveryFee)}</strong></div><div className="estimate-total"><span>{t("Estimated total")}</span><strong>{money(selected.total)}</strong></div><p className="help-text">{t("No payment collected.")}</p></div>
      <RentalHistory rental={selected} />
      <RentalActions key={selected.id} rental={selected} onUpdate={(next, details) => update(selected, next, details)} />
    </Modal>}
  </div>
}
