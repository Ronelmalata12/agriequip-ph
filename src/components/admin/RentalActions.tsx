import { useState } from 'react'
import type { FormEvent } from 'react'
import type { HandoverCheck, Rental, RentalStatus, TransitionDetails } from '../../types'
import { t } from '../../lib/language'

function HandoverForm({ pickup, onSave }: { pickup: boolean; onSave: (details: TransitionDetails) => void }) {
  const [check, setCheck] = useState<Omit<HandoverCheck, 'at'>>({ receivedBy: '', condition: 'Good', accessories: '', accessoriesStatus: 'All accounted for', inspectionConfirmed: false, safetyBriefing: false, notes: '' })
  const field = <K extends keyof typeof check>(key: K, value: typeof check[K]) => setCheck(current => ({ ...current, [key]: value }))
  return <form className="handover-form" noValidate onSubmit={event => { event.preventDefault(); onSave({ check }) }}><h3>{t(pickup ? 'Pickup checks' : 'Return checks')}</h3>
    <label>{t('Received by')}<input aria-label={t('Received by')} maxLength={100} value={check.receivedBy} onChange={event => field('receivedBy', event.target.value)} required /></label>
    <label>{t('Equipment condition')}<select aria-label={t('Equipment condition')} value={check.condition} onChange={event => field('condition', event.target.value as HandoverCheck['condition'])}>{['Good', 'Worn', 'Damaged'].map(value => <option value={value} key={value}>{t(value)}</option>)}</select></label>
    <label>{t('Accessories / inclusions')}<textarea aria-label={t('Accessories / inclusions')} rows={2} maxLength={400} value={check.accessories} onChange={event => field('accessories', event.target.value)} required /></label>
    <label>{t('Accessories status')}<select aria-label={t('Accessories status')} value={check.accessoriesStatus} onChange={event => field('accessoriesStatus', event.target.value as HandoverCheck['accessoriesStatus'])}>{['All accounted for', 'Missing items'].map(value => <option value={value} key={value}>{t(value)}</option>)}</select></label>
    <label>{t('Condition / damage notes')}<textarea aria-label={t('Condition / damage notes')} rows={3} maxLength={600} value={check.notes} onChange={event => field('notes', event.target.value)} /></label>
    <label className="check-label"><input type="checkbox" checked={check.inspectionConfirmed} onChange={event => field('inspectionConfirmed', event.target.checked)} />{t('Equipment inspected')}</label>
    {pickup && <label className="check-label"><input type="checkbox" checked={check.safetyBriefing} onChange={event => field('safetyBriefing', event.target.checked)} />{t('Safety briefing completed')}</label>}
    <button type="submit" className="button primary">{t(pickup ? 'Confirm pickup' : 'Confirm return')}</button>
  </form>
}

export function RentalActions({ rental, onUpdate }: { rental: Rental; onUpdate: (status: RentalStatus, details?: TransitionDetails) => void }) {
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  function reject(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onUpdate('Rejected', { reason, note }) }
  return <div className="admin-detail-actions">
    {rental.status === 'Pending' && <><label className="action-note">{t('Admin note (optional)')}<textarea aria-label={t('Admin note (optional)')} maxLength={600} rows={2} value={note} onChange={event => setNote(event.target.value)} /></label><button className="button primary" onClick={() => onUpdate('Approved', { note })}>{t('Approve request')}</button><button className="button secondary danger" onClick={() => setRejecting(!rejecting)}>{t('Reject request')}</button>{rejecting && <form className="reason-form" noValidate onSubmit={reject}><label>{t('Rejection reason')}<textarea aria-label={t('Rejection reason')} required maxLength={600} rows={3} value={reason} onChange={event => setReason(event.target.value)} /></label><button className="button secondary danger" type="submit">{t('Confirm rejection')}</button></form>}</>}
    {rental.status === 'Approved' && <p>{t('Awaiting farmer confirmation in Mobile → My Rentals.')}</p>}
    {rental.status === 'Confirmed' && <HandoverForm pickup onSave={details => onUpdate('Active', details)} />}
    {rental.status === 'Active' && <HandoverForm key="return" pickup={false} onSave={details => onUpdate('Completed', details)} />}
    {['Completed', 'Rejected', 'Cancelled'].includes(rental.status) && <p>{t('This record is retained for reference.')}</p>}
  </div>
}
