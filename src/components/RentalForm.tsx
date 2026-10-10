import { t } from '../lib/language'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { DeliveryDetails, Equipment, FarmerInformation, PickupMethod, Rental } from '../types'
import { dateLabel, money, rentalDays, today, validateDates } from '../lib/rentals'
import { checkAvailability, endForDuration, validateRequestDetails } from '../lib/workflow'
import { validateFarmer } from '../lib/profileStore'
import { RentalContactDetails } from './RentalContactDetails'
import type { RequestDates } from '../lib/workflow'
import { Icon } from './Icon'

export type { RequestDates } from '../lib/workflow'

export function RentalForm({ item, rentals, farmer, onEditProfile, onSubmit, onBack }: { item: Equipment; rentals: Rental[]; farmer: FarmerInformation; onEditProfile: () => void; onSubmit: (dates: RequestDates) => string; onBack: () => void }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [duration, setDuration] = useState('1')
  const [pickup, setPickup] = useState<PickupMethod>('Self pickup')
  const [delivery, setDelivery] = useState<DeliveryDetails>({ address: farmer.farmLocation, landmark: '', preferredTime: '' })
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [checked, setChecked] = useState(false)
  const [step, setStep] = useState<'dates' | 'review'>('dates')
  const reviewHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (step === 'review') reviewHeading.current?.focus() }, [step])
  const days = rentalDays(startDate, endDate)
  const fee = pickup === 'Owner delivery' ? item.deliveryFee : 0
  const dates = { startDate, endDate, pickup, farmer, delivery: pickup === 'Owner delivery' ? delivery : undefined, notes: notes.trim() }
  const dateError = startDate && endDate ? validateDates(startDate, endDate) : ''
  const availabilityError = checkAvailability(item, dates, rentals)
  const validEstimate = days > 0 && !dateError
  const reserved = rentals.filter((r) => r.equipmentId === item.id && ['Approved', 'Confirmed', 'Active'].includes(r.status))

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = checkAvailability(item, dates, rentals) || validateRequestDetails(dates)
    if (validation) { setError(validation); return }
    if (step === 'dates') { setError(''); setStep('review'); return }
    setError(onSubmit(dates))
  }

  const estimate = <div className="estimate"><h3>{t("Rental estimate ")}<span>{t("Estimated prices")}</span></h3>
    <div><span>{validEstimate ? t(`${money(item.rate)} × ${days} ${days === 1 ? 'day' : 'days'}`) : t(`${money(item.rate)} per day`)}</span><strong>{validEstimate ? money(item.rate * days) : t('—')}</strong></div>
    <div><span>{pickup === 'Owner delivery' ? t('Delivery fee (once)') : t('Self pickup')}</span><strong>{money(fee)}</strong></div>
    <div className="estimate-total"><span>{t("Estimated total")}</span><strong>{validEstimate ? money(item.rate * days + fee) : t('—')}</strong></div>
    <p className="help-text">{t("Fuel and services not listed in the equipment details are excluded. No payment will be collected.")}</p>
  </div>

  return <form onSubmit={submit} noValidate className="rental-form">
    <div className="booking-steps"><span className={step === 'dates' ? 'current' : 'done'}>{t("1 · Dates & pickup")}</span><Icon name="chevron" size={14} /><span className={step === 'review' ? 'current' : ''}>{t("2 · Review request")}</span></div>
    <div className="form-intro"><span className="small-icon"><Icon name="equipment" /></span><div><h3>{item.name}</h3><p>{item.owner}</p></div></div>
    {step === 'dates' ? <>
      <section className="rental-farmer-summary"><h3>{t("Farmer information")}</h3><p>{farmer.name}{t(" · ")}{farmer.contact || t('Contact number missing')}</p><p>{farmer.barangay || t('Barangay missing')}{t(" · ")}{farmer.farmLocation || t('Farm location missing')}</p>{validateFarmer(farmer) && <p className="help-text">{t("Complete your profile before submitting a rental request.")}</p>}<button type="button" className="text-button" onClick={onEditProfile}>{t("Edit farmer profile")}</button></section>
      <label>{t("Start date")}<input type="date" name="startDate" min={today()} value={startDate} required aria-describedby="date-help" onChange={(event) => {
        const next = event.target.value; setStartDate(next); setError('')
        if (duration !== 'custom') setEndDate(endForDuration(next, Number(duration)))
      }} /></label>
      <label className="duration-field">{t("Rental duration")}<select aria-label={t("Rental duration")} value={duration} onChange={(event) => {
        setDuration(event.target.value); setError('')
        if (event.target.value !== 'custom') setEndDate(endForDuration(startDate, Number(event.target.value)))
      }}><option value="1">{t("1 day")}</option><option value="3">{t("3 days")}</option><option value="7">{t("7 days")}</option><option value="14">{t("14 days")}</option><option value="custom">{t("Custom dates")}</option></select></label>
      <label>{t("End date")}<input type="date" name="endDate" min={startDate && startDate >= today() ? startDate : today()} value={endDate} required aria-describedby="date-help" onChange={(event) => { setEndDate(event.target.value); setDuration('custom'); setError('') }} /></label>
      <p id="date-help" className="help-text">{t("Both dates count. Same-day rental = 1 day.")}</p>
      <button type="button" className="button secondary full-width" onClick={() => { setChecked(true); setError(availabilityError) }}><Icon name="calendar" size={17} />{t("Check availability")}</button>
      {checked && !availabilityError && <p className="availability-result" role="status"><Icon name="check" size={17} />{t("Available for your selected ")}{days} {days === 1 ? t('day') : t('days')}{t(".")}</p>}
      {reserved.length > 0 && <div className="reserved-dates"><strong>{t("Reserved dates")}</strong>{reserved.map((r) => <p key={r.id}>{dateLabel(r.startDate)}{t(" — ")}{dateLabel(r.endDate)}</p>)}</div>}
      <label className="pickup-field">{t("Pickup method")}<select name="pickup" aria-label={t("Pickup method")} value={t(pickup)} onChange={(event) => setPickup(event.target.value as PickupMethod)}><option value="Self pickup">{t("Self pickup")}</option><option value="Owner delivery">{t("Owner delivery")}</option></select></label>
      <p className="help-text">{pickup === 'Self pickup' ? t(`Collect from ${item.location}.`) : t('Delivery fee covers one rental within Nasugbu.')}</p>
      {pickup === 'Owner delivery' && <fieldset className="delivery-fields"><legend>{t("Delivery details")}</legend>
        <label>{t("Delivery address")}<textarea aria-label={t("Delivery address")} rows={3} maxLength={250} required value={delivery.address} onChange={e => setDelivery({ ...delivery, address: e.target.value })} placeholder={t("Complete delivery address in Nasugbu")} /></label>
        <label>{t("Landmark (optional)")}<input maxLength={200} value={delivery.landmark} onChange={e => setDelivery({ ...delivery, landmark: e.target.value })} placeholder={t("e.g. Near the barangay hall")} /></label>
        <label>{t("Preferred delivery time")}<select aria-label={t("Preferred delivery time")} value={delivery.preferredTime} required onChange={e => setDelivery({ ...delivery, preferredTime: e.target.value })}><option value="">{t("Choose a time")}</option><option value="Morning (8 AM–12 PM)">{t("Morning (8 AM–12 PM)")}</option><option value="Afternoon (1–5 PM)">{t("Afternoon (1–5 PM)")}</option><option value="Flexible">{t("Flexible")}</option></select></label>
        <p className="help-text">{t("Preferred time on the rental start date. Final arrangements are coordinated with the admin.")}</p>
      </fieldset>}
      <label>{t("Rental notes (optional)")}<textarea aria-label={t("Rental notes (optional)")} rows={3} maxLength={600} value={notes} onChange={e => setNotes(e.target.value)} placeholder={t("Access instructions or other rental information")} /></label>
      {estimate}
    </> : <>
      <h3 className="review-title" ref={reviewHeading} tabIndex={-1}>{t("Review before you request")}</h3>
      <RentalContactDetails {...dates} />
      <dl className="booking-summary"><div><dt>{t("Rental dates")}</dt><dd>{dateLabel(startDate)}{t(" — ")}{dateLabel(endDate)}</dd></div><div><dt>{t("Duration")}</dt><dd>{days} {days === 1 ? t('day') : t('days')}</dd></div><div><dt>{t("Pickup method")}</dt><dd>{t(pickup)}</dd></div><div><dt>{t("Location")}</dt><dd>{item.location}</dd></div></dl>
      {estimate}
      <p className="review-note"><Icon name="clock" size={18} />{t("After submitting, wait for admin approval. You can then confirm the booking in My Rentals.")}</p>
    </>}
    {(error || (step === 'dates' && dateError)) && <p className="form-error" role="alert">{t(error || dateError)}</p>}
    <div className="form-actions"><button type="button" className="button secondary" onClick={() => { if (step === 'review') { setStep('dates'); setError('') } else onBack() }}>{step === 'review' ? t('Edit dates') : t('Back to details')}</button><button type="submit" className="button primary">{step === 'review' ? t('Submit request') : t('Review request')} <Icon name="arrow" size={18} /></button></div>
  </form>
}
