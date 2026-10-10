import { t } from '../../lib/language'
import { useEffect, useRef, useState } from 'react'
import type { Category, Equipment, RentalStatus, TransitionDetails } from '../../types'
import { categories } from '../../data/equipment'
import { equipmentForRental, useEquipmentStore } from '../../lib/equipmentStore'
import { useProfileStore } from '../../lib/profileStore'
import { RentalContactDetails } from '../RentalContactDetails'
import { dateLabel, money, rentalDays } from '../../lib/rentals'
import { createRequest, transitionRental } from '../../lib/workflow'
import type { RequestDates } from '../../lib/workflow'
import { setDemoRentals, useRentalStore } from '../../lib/rentalStore'
import { Icon } from '../Icon'
import type { IconName } from '../Icon'
import { EquipmentPhoto } from '../EquipmentPhoto'
import { EquipmentCard } from '../EquipmentCard'
import { RentalForm } from '../RentalForm'
import { StatusBadge } from '../RentalList'
import { FarmerProfile, FarmerSettings } from './FarmerAccountScreens'
import { RentalHistory } from '../RentalHistory'
import { NotificationList } from '../NotificationList'
import { useNotifications } from '../../lib/notifications'
import { ownerForEquipment, useOwnerStore } from '../../lib/ownerStore'
import '../../Mobile.css'

type Screen = 'home' | 'equipment' | 'details' | 'booking' | 'success' | 'rentals' | 'rentalDetails' | 'settings' | 'profile' | 'notifications'
type RentalTab = 'Requests' | 'Active' | 'Previous'
const categoryIcons: Record<Category, IconName> = { 'Land preparation': 'equipment', 'Crop care': 'leaf', Irrigation: 'pin', Harvesting: 'harvest', Transport: 'truck', 'Hand tools': 'tools' }
const progress = ['Pending', 'Approved', 'Confirmed', 'Active', 'Completed']
const progressLabels = ['Request sent', 'Admin approved', 'Booking confirmed', 'Equipment in use', 'Returned & completed']
const navigation: { page: Screen; label: string; icon: IconName }[] = [
  { page: 'home', label: 'Home', icon: 'owner' },
  { page: 'equipment', label: 'Equipment', icon: 'equipment' },
  { page: 'rentals', label: 'My Rentals', icon: 'rentals' },
  { page: 'settings', label: 'Settings', icon: 'settings' },
  { page: 'profile', label: 'Profile', icon: 'profile' },
]

export function FarmerMobile() {
  const contentRef = useRef<HTMLElement>(null)
  const { rentals, warning } = useRentalStore()
  const { unread } = useNotifications(rentals, 'Farmer')
  useOwnerStore()
  const { data: equipment, warning: equipmentWarning } = useEquipmentStore()
  const { data: farmer } = useProfileStore()
  const [screen, setScreen] = useState<Screen>('home')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | 'All equipment'>('All equipment')
  const [availability, setAvailability] = useState('All listings')
  const [selectedId, setSelectedId] = useState('')
  const selected = equipment.find(item => item.id === selectedId)
  const selectedOwner = selected ? ownerForEquipment(selected) : undefined
  const [rentalId, setRentalId] = useState('')
  const [tab, setTab] = useState<RentalTab>('Requests')
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null)
  const [cancelReview, setCancelReview] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const currentRental = rentals.find((r) => r.id === rentalId)
  const rentalItem = currentRental ? equipmentForRental(currentRental, equipment) : undefined
  const catalog = equipment.filter((e) => (category === 'All equipment' || e.category === category)
    && (availability === 'All listings' || e.available)
    && `${e.name} ${e.category} ${t(e.category)} ${e.owner} ${e.location}`.toLowerCase().includes(search.trim().toLowerCase()))
  const requests = rentals.filter((r) => ['Pending', 'Approved', 'Confirmed'].includes(r.status))
  const active = rentals.filter((r) => r.status === 'Active')
  const previous = rentals.filter((r) => ['Completed', 'Rejected', 'Cancelled'].includes(r.status))
  const tabRentals = tab === 'Requests' ? requests : tab === 'Active' ? active : previous
  const navScreen = ['details', 'booking'].includes(screen) ? 'equipment' : ['success', 'rentalDetails'].includes(screen) ? 'rentals' : screen

  useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: 'instant' }) }, [screen, rentalId])
  useEffect(() => {
    document.body.classList.add('farmer-document')
    return () => document.body.classList.remove('farmer-document')
  }, [])

  function navigate(next: Screen) { setScreen(next); setCancelReview(false); setCancelReason('') }
  function viewEquipment(item: Equipment) { setSelectedId(item.id); navigate('details') }
  function viewRental(id: string) { setRentalId(id); navigate('rentalDetails') }
  function browseCategory(next: Category) { setCategory(next); setSearch(''); setAvailability('All listings'); navigate('equipment') }

  function request(dates: RequestDates) {
    if (!selected) return 'Choose equipment first.'
    const result = createRequest(selected, dates, rentals)
    if (!result.rental) return result.error
    setDemoRentals([result.rental, ...rentals])
    setRentalId(result.rental.id); setTab('Requests'); setNotice(null); navigate('success')
    return ''
  }

  function updateStatus(status: RentalStatus, details: TransitionDetails = {}) {
    if (!currentRental) return
    const result = transitionRental(rentals, currentRental.id, status, 'Farmer', details)
    if (result.error) { setNotice({ message: result.error, error: true }); contentRef.current?.scrollTo({ top: 0 }); return }
    setDemoRentals(result.rentals); setCancelReview(false)
    setNotice({ message: status === 'Confirmed' ? 'Booking confirmed. Your equipment is ready for the agreed pickup.' : 'Rental cancelled. You can find it under Previous.', error: false })
  }

  return <div className="mobile-app">
    <a href="#farmer-content" className="skip-link">{t("Skip to farmer content")}</a>
    <header className="farmer-header"><button className="farmer-brand" aria-label={t("Go to farmer home")} onClick={() => navigate('home')}><span><Icon name="leaf" size={23} /></span><strong>{t("AgriEquip ")}<small>{t("PH")}</small></strong></button><div className="farmer-header-actions"><button className="icon-button notification-bell" aria-label={t("Open notifications")} onClick={() => navigate('notifications')}><Icon name="bell" size={19} />{unread > 0 && <span className="unread-count">{Math.min(unread, 99)}</span>}</button><button className="farmer-avatar" aria-label={t("Open farmer profile")} onClick={() => navigate('profile')}>{t("KF")}</button></div></header>
    <div className="farmer-demo-strip"><span className="live-dot" />{t("FARMER · Nasugbu, Batangas")}</div>
    <main className="farmer-main" id="farmer-content" ref={contentRef} tabIndex={-1}>
      {warning && <p className="form-error" role="alert">{t(warning)}</p>}
      {equipmentWarning && <p className="form-error" role="alert">{t(equipmentWarning)}</p>}
      {notice && <div className={`farmer-notice ${notice.error ? 'error' : ''}`} role={notice.error ? 'alert' : 'status'}><p>{t(notice.message)}</p><button className="icon-button" aria-label={t("Dismiss farmer message")} onClick={() => setNotice(null)}><Icon name="close" size={18} /></button></div>}

      {screen === 'home' && <>
        <div className="farmer-greeting"><p>{t("YOUR NEXT SEASON STARTS HERE")}</p><h1>{t("Good day, ka-farmer.")}</h1><span>{t("Big plans for your small plot? Let's get growing.")}</span></div>
        <section className="farmer-hero"><div><span>{t("LOCAL TOOLS. SHARED OPPORTUNITIES.")}</span><h2>{t("Rent better.")}<br />{t("Grow together.")}</h2><p>{t("Find farming tools close to home.")}</p><button className="button sunshine" onClick={() => navigate('equipment')}>{t("Find equipment ")}<Icon name="arrow" size={17} /></button></div><img className="farmer-hero-photo" src={`${import.meta.env.BASE_URL}images/farm-banner-v2.jpg`} alt="" aria-hidden="true" decoding="async" /></section>
        <form className="farmer-search" onSubmit={(event) => { event.preventDefault(); navigate('equipment') }}><Icon name="search" size={19} /><input aria-label={t("Search farm equipment")} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("What does your farm need?")} /><button className="icon-button" aria-label={t("Search catalog")} type="submit"><Icon name="arrow" size={18} /></button></form>
        {requests.some((r) => r.status === 'Approved') && <button className="approval-prompt" onClick={() => { setTab('Requests'); navigate('rentals') }}><Icon name="check" size={20} /><span>{t("An admin approved your request.")}<strong>{t("Review and confirm your booking")}</strong></span><Icon name="chevron" size={18} /></button>}
        <section className="farmer-section"><div className="farmer-section-heading"><h2>{t("What are you working on?")}</h2></div><div className="farmer-categories">{categories.map((c) => <button key={c} onClick={() => browseCategory(c)}><span><Icon name={categoryIcons[c]} size={23} /></span>{t(c)}</button>)}</div></section>
        <section className="farmer-section"><div className="farmer-section-heading"><h2>{t("For your next day in the field")}</h2><button className="text-button" onClick={() => { setCategory('All equipment'); setSearch(''); navigate('equipment') }}>{t("See all ")}<Icon name="arrow" size={16} /></button></div><div className="equipment-grid">{[equipment[0], equipment[3]].map((item) => <EquipmentCard key={item.id} item={item} onView={viewEquipment} realistic />)}</div></section>
        <div className="farmer-local-note"><Icon name="owner" size={23} /><div><strong>{t("Your community, your farming partners.")}</strong><p>{equipment.length}{t(" fictional listings across ")}{categories.length}{t(" categories. Prices and availability are for this presentation only.")}</p></div></div>
      </>}

      {screen === 'equipment' && <>
        <div className="farmer-page-title"><p>{t("TOOLS FOR EVERY TASK")}</p><h1>{t("Find your equipment")}</h1><span>{t("Machinery, everyday tools, and more.")}</span></div>
        <label className="farmer-search"><Icon name="search" size={19} /><input type="search" aria-label={t("Search farm equipment")} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Search tools, machinery, or owner…")} /></label>
        <div className="farmer-filters"><label><span>{t("Category")}</span><select aria-label={t("Mobile equipment category")} value={category} onChange={(event) => setCategory(event.target.value as Category | 'All equipment')}><option value="All equipment">{t("All equipment")}</option>{categories.map((c) => <option value={c} key={c}>{t(c)}</option>)}</select></label><label><span>{t("Availability")}</span><select aria-label={t("Mobile availability")} value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="All listings">{t("All listings")}</option><option value="Available listings">{t("Available listings")}</option></select></label></div>
        <p className="farmer-result-count" role="status">{catalog.length} {catalog.length === 1 ? t('listing') : t('listings')}{t(" · Fictional daily rates")}</p>
        {catalog.length ? <div className="equipment-grid">{catalog.map((item) => <EquipmentCard key={item.id} item={item} onView={viewEquipment} realistic />)}</div> : <div className="empty-state"><Icon name="search" size={30} /><h2>{t("No matching equipment")}</h2><p>{t("Try a different tool or category.")}</p><button className="button secondary" onClick={() => { setCategory('All equipment'); setSearch(''); setAvailability('All listings') }}>{t("Clear filters")}</button></div>}
      </>}

      {screen === 'details' && selected && <>
        <button className="farmer-back" onClick={() => navigate('equipment')}><Icon name="back" size={18} />{t("Back to equipment")}</button>
        <div className={`detail-picture art-${selected.art}`}><EquipmentPhoto item={selected} /><span className={`availability ${selected.available ? '' : 'unavailable'}`}><span />{selected.available ? t('Available') : t('Unavailable')}</span></div>
        <div className="farmer-detail-heading"><p className="eyebrow">{t(selected.category)}</p><h1>{selected.name}</h1><p className="location"><Icon name="pin" size={15} />{selected.location}</p><div className="farmer-price"><strong>{money(selected.rate)}</strong><span>{t(" / calendar day")}</span><small>{t("Daily rate")}</small></div></div>
        <p className="farmer-description">{selected.description}</p>
        <div className="detail-owner"><Icon name="owner" size={24} /><div><span className="help-text">{t("Equipment owner · fictional")}</span><p>{selected.owner}</p>{selectedOwner?.phone && <p>{selectedOwner.contactPerson}{t(" · ")}{selectedOwner.phone}</p>}</div></div>
        <section className="farmer-detail-section"><h2>{t("Included & specifications")}</h2><ul className="spec-list">{selected.specs.map((spec) => <li key={spec}><Icon name="check" size={17} />{spec}</li>)}</ul></section>
        <section className="farmer-detail-section"><h2>{t("Availability")}</h2><p className="farmer-description">{selected.available ? t('Choose rental dates on the next screen to check availability.') : t('This unit is under maintenance. Please choose another listing.')}</p>{rentals.filter((r) => r.equipmentId === selected.id && ['Approved', 'Confirmed', 'Active'].includes(r.status)).map((r) => <p className="reserved-range" key={r.id}><Icon name="calendar" size={15} />{t("Reserved: ")}{dateLabel(r.startDate)}{t(" — ")}{dateLabel(r.endDate)}</p>)}</section>
        <button className="button primary full-width" disabled={!selected.available} onClick={() => navigate('booking')}>{selected.available ? t('Choose rental dates') : t('Currently unavailable')}<Icon name="arrow" size={18} /></button>
        <p className="farmer-footnote">{t("Request first. Confirm after admin approval. No payment collected.")}</p>
      </>}

      {screen === 'booking' && selected && <>
        <button className="farmer-back" onClick={() => navigate('details')}><Icon name="back" size={18} />{t("Back to equipment details")}</button><div className="farmer-page-title"><p>{t("LET'S PLAN YOUR NEXT RENTAL")}</p><h1>{t("Plan your rental")}</h1><span>{t("Choose your dates, then review the total.")}</span></div><RentalForm item={selected} rentals={rentals} farmer={farmer} onEditProfile={() => navigate('profile')} onSubmit={request} onBack={() => navigate('details')} />
      </>}

      {screen === 'success' && currentRental && rentalItem && <div className="farmer-success"><span className="success-mark"><Icon name="check" size={35} /></span><p className="eyebrow">{t("ONE STEP CLOSER TO YOUR NEXT HARVEST")}</p><h1>{t("Request sent!")}</h1><p>{t("An admin will review your request. Your booking is confirmed after admin approval and your confirmation.")}</p><div className="success-summary"><StatusBadge status={currentRental.status} /><h2>{rentalItem.name}</h2><p>{dateLabel(currentRental.startDate)}{t(" — ")}{dateLabel(currentRental.endDate)}</p><strong>{money(currentRental.total)}</strong><span>{t("Estimated total · no payment collected")}</span><small>{t("Reference ")}{currentRental.id.slice(-8).toUpperCase()}</small></div><button className="button primary full-width" onClick={() => viewRental(currentRental.id)}>{t("View rental request ")}<Icon name="arrow" size={18} /></button><button className="button secondary full-width" onClick={() => navigate('equipment')}>{t("Browse more equipment")}</button><p className="farmer-footnote">{t("For the presentation, switch to Web → Rental Requests to approve this request.")}</p></div>}

      {screen === 'rentals' && <>
        <div className="farmer-page-title"><p>{t("EVERY RENTAL, IN ONE PLACE")}</p><h1>{t("My rentals")}</h1><span>{t("From your first request to your last return.")}</span></div><div className="farmer-rental-tabs" role="group" aria-label={t("Rental groups")}>{(['Requests', 'Active', 'Previous'] as const).map((group) => <button key={group} aria-label={t(group)} aria-pressed={tab === group} className={tab === group ? 'active' : ''} onClick={() => setTab(group)}>{t(group)}<span>{group === 'Requests' ? requests.length : group === 'Active' ? active.length : previous.length}</span></button>)}</div>
        {tabRentals.length ? <div className="farmer-rentals">{tabRentals.map((r) => {
          const item = equipmentForRental(r, equipment)
          return <article className="farmer-rental-card" key={r.id}><div className="farmer-rental-card-top"><div className={`farmer-rental-art art-${item.art}`}><EquipmentPhoto item={item} /></div><div><StatusBadge status={r.status} /><h2>{item.name}</h2><p>{rentalDays(r.startDate, r.endDate)} {rentalDays(r.startDate, r.endDate) === 1 ? t('day') : t('days')}{t(" · ")}{t(r.pickup)}</p></div></div><div className="farmer-rental-dates"><Icon name="calendar" size={16} />{dateLabel(r.startDate)}{t(" — ")}{dateLabel(r.endDate)}</div><div className="farmer-rental-bottom"><strong>{money(r.total)}</strong><button className="text-button" aria-label={t(`View rental for ${item.name}`)} onClick={() => viewRental(r.id)}>{r.status === 'Approved' ? t('Review & confirm') : t('View rental')}<Icon name="arrow" size={16} /></button></div>{r.status === 'Approved' && <p className="approval-reminder">{t("Admin approved · your confirmation is needed.")}</p>}</article>
        })}</div> : <div className="empty-state"><span className="empty-icon"><Icon name="rentals" size={28} /></span><h2>{tab === 'Requests' ? t('Your next rental starts here') : t(`No ${tab.toLowerCase()} rentals yet`)}</h2><p>{tab === 'Active' ? t('Confirmed rentals appear here after the admin records pickup.') : t('Explore local equipment to get started.')}</p><button className="button primary" onClick={() => navigate('equipment')}>{t("Browse equipment")}</button></div>}
      </>}

      {screen === 'rentalDetails' && currentRental && rentalItem && <>
        <button className="farmer-back" onClick={() => navigate('rentals')}><Icon name="back" size={18} />{t("Back to my rentals")}</button><div className="farmer-page-title"><p>{t("REFERENCE ")}{currentRental.id.slice(-8).toUpperCase()}</p><h1>{t("Rental details")}</h1></div><div className="farmer-booking-title"><StatusBadge status={currentRental.status} /><h2>{rentalItem.name}</h2><p>{rentalItem.owner}</p></div>
        <dl className="booking-summary"><div><dt>{t("Rental dates")}</dt><dd>{dateLabel(currentRental.startDate)}{t(" — ")}{dateLabel(currentRental.endDate)}</dd></div><div><dt>{t("Duration")}</dt><dd>{rentalDays(currentRental.startDate, currentRental.endDate)}{t(" day(s)")}</dd></div><div><dt>{t("Pickup method")}</dt><dd>{t(currentRental.pickup)}</dd></div><div><dt>{t("Pickup / owner location")}</dt><dd>{rentalItem.location}</dd></div></dl>
          <RentalContactDetails {...currentRental} />
          <div className="estimate"><h3>{t("Price breakdown ")}<span>{t("Estimate")}</span></h3><div><span>{money(currentRental.dailyRate)}{t(" × ")}{rentalDays(currentRental.startDate, currentRental.endDate)}{t(" day(s)")}</span><strong>{money(currentRental.dailyRate * rentalDays(currentRental.startDate, currentRental.endDate))}</strong></div><div><span>{t("Delivery fee")}</span><strong>{money(currentRental.deliveryFee)}</strong></div><div className="estimate-total"><span>{t("Total")}</span><strong>{money(currentRental.total)}</strong></div><p className="help-text">{t("No payment collected. Refer to the listing for included services.")}</p></div>
        <RentalHistory rental={currentRental} />
        {['Cancelled', 'Rejected'].includes(currentRental.status) ? <p className="review-note">{t("This rental was ")}{t(currentRental.status)}{t(". It is kept in Previous for your records.")}</p> : <section className="rental-progress"><h2>{t("Your rental journey")}</h2><ol>{progressLabels.map((label, index) => <li key={label} className={progress.indexOf(currentRental.status) >= index ? 'done' : ''}><span>{progress.indexOf(currentRental.status) >= index ? <Icon name="check" size={14} /> : index + 1}</span>{t(label)}</li>)}</ol></section>}
        {currentRental.status === 'Pending' && <p className="review-note"><Icon name="clock" size={20} />{t("Awaiting admin approval. Approval is managed in Web → Rental Requests.")}</p>}
        {currentRental.status === 'Approved' && <><p className="review-note">{t("The admin approved these dates. Review the details and total above, then confirm your booking.")}</p><button className="button primary full-width" onClick={() => updateStatus('Confirmed')}>{t("Confirm booking ")}<Icon name="check" size={18} /></button></>}
        {currentRental.status === 'Confirmed' && <p className="review-note"><Icon name="check" size={20} />{t("Booking confirmed. The admin can now record pickup in the Web dashboard.")}</p>}
        {currentRental.status === 'Active' && <p className="review-note"><Icon name="calendar" size={20} />{t("Equipment is in use. Return it by ")}{dateLabel(currentRental.endDate)}{t(". The admin records the return.")}</p>}
        {currentRental.status === 'Completed' && <p className="review-note"><Icon name="check" size={20} />{t("Returned and completed. Thank you for growing with your community.")}</p>}
        {['Pending', 'Approved', 'Confirmed'].includes(currentRental.status) && <div className="farmer-cancel">{cancelReview ? <div><p>{t("Cancel this rental? It will move to Previous.")}</p><label className="cancellation-reason">{t("Cancellation reason")}<textarea aria-label={t("Cancellation reason")} rows={3} maxLength={600} value={cancelReason} onChange={event => setCancelReason(event.target.value)} /></label><button className="button secondary" onClick={() => setCancelReview(false)}>{t("Keep rental")}</button><button className="button secondary danger" onClick={() => updateStatus('Cancelled', { reason: cancelReason })}>{t("Confirm cancellation")}</button></div> : <button className="text-button danger" onClick={() => setCancelReview(true)}>{t("Cancel rental")}</button>}</div>}
      </>}
      {screen === 'rentalDetails' && !currentRental && <div className="empty-state"><h1>{t("Rental no longer available")}</h1><p>{t("The saved rental data may have been cleared.")}</p><button className="button primary" onClick={() => navigate('rentals')}>{t("Back to my rentals")}</button></div>}
      {screen === 'profile' && <FarmerProfile requests={requests.length} active={active.length} previous={previous.length} onViewRentals={() => navigate('rentals')} onContinueRental={selected ? () => navigate('booking') : undefined} />}
      {screen === 'settings' && <FarmerSettings />}
      {screen === 'notifications' && <NotificationList rentals={rentals} role="Farmer" onView={viewRental} />}
      <p className="farmer-disclaimer">{t("Sample listings · No real transactions")}</p>
    </main>
    <nav className="farmer-bottom-nav" aria-label={t("Farmer navigation")}>{navigation.map((item) => <button key={item.page} aria-current={navScreen === item.page ? 'page' : undefined} className={navScreen === item.page ? 'active' : ''} onClick={() => navigate(item.page)}><Icon name={item.icon} size={20} /><span>{t(item.label)}</span></button>)}</nav>
  </div>
}
