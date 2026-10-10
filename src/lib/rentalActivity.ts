import type { HandoverCheck, Rental, RentalEvent, RentalStatus } from '../types'
import { calendarDay, today } from './rentals'

export const rentalStatuses: RentalStatus[] = ['Pending', 'Approved', 'Confirmed', 'Active', 'Completed', 'Rejected', 'Cancelled']
export function historyForRental(rental: Rental): RentalEvent[] {
  if (rental.history?.length) return rental.history
  return [{ id: `${rental.id}:created`, status: 'Pending', actor: 'Farmer', at: rental.createdAt }, ...(rental.status === 'Pending' ? [] : [{ id: `${rental.id}:imported`, status: rental.status, actor: 'Imported record' as const, note: 'Earlier status changes were not recorded.' }])]
}
export function isRentalEvent(value: unknown): value is RentalEvent {
  if (!value || typeof value !== 'object') return false
  const e = value as RentalEvent
  return typeof e.id === 'string' && rentalStatuses.includes(e.status) && ['Farmer', 'Admin', 'Imported record'].includes(e.actor) && (e.at === undefined || (typeof e.at === 'string' && Number.isFinite(Date.parse(e.at)))) && [e.reason, e.note].every(text => text === undefined || (typeof text === 'string' && text.length <= 600))
}
export function validateCheck(check: Omit<HandoverCheck, 'at'> | undefined, pickup: boolean) {
  if (!check || !check.receivedBy.trim() || !check.accessories.trim() || !['Good', 'Worn', 'Damaged'].includes(check.condition) || !['All accounted for', 'Missing items'].includes(check.accessoriesStatus)) return 'Complete the condition, accessories, and received-by fields.'
  if (!check.inspectionConfirmed || (pickup && !check.safetyBriefing)) return 'Confirm the inspection and required handover checks.'
  if ((check.condition === 'Damaged' || check.accessoriesStatus === 'Missing items') && !check.notes.trim()) return 'Add notes explaining the damage or missing accessories.'
  return ''
}
export function isHandoverCheck(value: unknown): value is HandoverCheck {
  if (!value || typeof value !== 'object') return false
  const c = value as HandoverCheck
  return typeof c.at === 'string' && Number.isFinite(Date.parse(c.at)) && ['receivedBy', 'accessories', 'notes'].every(key => typeof (c as unknown as Record<string, unknown>)[key] === 'string') && ['Good', 'Worn', 'Damaged'].includes(c.condition) && ['All accounted for', 'Missing items'].includes(c.accessoriesStatus) && typeof c.inspectionConfirmed === 'boolean' && typeof c.safetyBriefing === 'boolean'
}
export function rentalDueState(rental: Rental, date = today()) {
  if (rental.status !== 'Active') return null
  const days = calendarDay(rental.endDate) - calendarDay(date)
  return days < 0 ? 'Overdue' : days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : null
}
