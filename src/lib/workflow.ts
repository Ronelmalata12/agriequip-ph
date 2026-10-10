import type { DeliveryDetails, Equipment, FarmerInformation, PickupMethod, Rental, RentalStatus, Role, TransitionDetails } from '../types'
import { getEquipment } from './equipmentStore'
import { validateFarmer } from './profileStore'
import { calendarDay, overlaps, rentalDays, validateDates } from './rentals'
import { historyForRental, validateCheck } from './rentalActivity'

export interface RequestDates { startDate: string; endDate: string; pickup: PickupMethod; farmer?: FarmerInformation; delivery?: DeliveryDetails; notes?: string }

export function validateRequestDetails(dates: RequestDates) {
  if (!dates.farmer) return 'Complete your farmer profile before requesting equipment.'
  const profileError = validateFarmer(dates.farmer)
  if (profileError) return profileError
  if (dates.pickup === 'Owner delivery' && (!dates.delivery?.address.trim() || !['Morning (8 AM–12 PM)', 'Afternoon (1–5 PM)', 'Flexible'].includes(dates.delivery.preferredTime))) return 'Enter a delivery address and choose a preferred delivery time.'
  return ''
}

export function endForDuration(start: string, days: number) {
  const day = calendarDay(start)
  if (!Number.isFinite(day) || !Number.isInteger(days) || days < 1) return ''
  return new Date((day + days - 1) * 86400000).toISOString().slice(0, 10)
}

export function checkAvailability(item: Equipment, dates: RequestDates, rentals: Rental[]) {
  const invalid = validateDates(dates.startDate, dates.endDate)
  if (invalid) return invalid
  if (!item.available) return 'This equipment is currently unavailable. Choose another listing.'
  if (overlaps(rentals, item.id, dates.startDate, dates.endDate)) return 'These dates are already reserved. Choose another date range.'
  return ''
}

export function createRequest(item: Equipment, dates: RequestDates, rentals: Rental[]) {
  // Read the current listing so an admin's latest rate or maintenance edit is respected.
  const current = getEquipment().find(e => e.id === item.id)
  if (!current) return { error: 'This equipment listing is no longer available.', rental: null }
  item = current
  const error = checkAvailability(item, dates, rentals) || validateRequestDetails(dates)
  if (error) return { error, rental: null }
  if (rentals.some((r) => r.equipmentId === item.id && r.startDate === dates.startDate && r.endDate === dates.endDate && ['Pending', 'Approved', 'Confirmed', 'Active'].includes(r.status))) {
    return { error: 'You already have a request for this equipment and date range.', rental: null }
  }
  const deliveryFee = dates.pickup === 'Owner delivery' ? item.deliveryFee : 0
  const rental: Rental = { id: crypto.randomUUID(), equipmentId: item.id, ...dates, delivery: dates.pickup === 'Owner delivery' ? dates.delivery : undefined, equipmentSnapshot: { ...item }, dailyRate: item.rate, deliveryFee, total: rentalDays(dates.startDate, dates.endDate) * item.rate + deliveryFee, status: 'Pending', createdAt: new Date().toISOString() }
  rental.history = [{ id: crypto.randomUUID(), status: 'Pending', actor: 'Farmer', at: rental.createdAt }]
  return { error: '', rental }
}

const transitions: Partial<Record<RentalStatus, RentalStatus[]>> = {
  Pending: ['Approved', 'Rejected', 'Cancelled'], Approved: ['Confirmed', 'Cancelled'],
  Confirmed: ['Active', 'Cancelled'], Active: ['Completed'],
}

export function transitionRental(rentals: Rental[], id: string, status: RentalStatus, role: Role, details: TransitionDetails = {}) {
  const rental = rentals.find((r) => r.id === id)
  if (!rental || !transitions[rental.status]?.includes(status)) return { error: 'This rental cannot move to that status.', rentals }
  const farmerAction = status === 'Confirmed' || status === 'Cancelled'
  if ((farmerAction && role !== 'Farmer') || (!farmerAction && role !== 'Admin')) return { error: 'This action is not available for this role.', rentals }
  if (['Rejected', 'Cancelled'].includes(status) && !details.reason?.trim()) return { error: 'Enter a reason before rejecting or cancelling this rental.', rentals }
  if ([details.reason, details.note, details.check?.notes].some(text => text && text.length > 600)) return { error: 'Keep reasons and notes within 600 characters.', rentals }
  if (status === 'Active' || status === 'Completed') {
    const checkError = validateCheck(details.check, status === 'Active')
    if (checkError) return { error: checkError, rentals }
  }
  if (status === 'Approved' || status === 'Confirmed') {
    if (validateDates(rental.startDate, rental.endDate)) return { error: 'These rental dates are no longer valid. The farmer must submit a new request with current or future dates.', rentals }
    const item = getEquipment().find((e) => e.id === rental.equipmentId)
    if (!item?.available) return { error: 'This equipment is currently unavailable.', rentals }
    if (overlaps(rentals, rental.equipmentId, rental.startDate, rental.endDate, rental.id)) return { error: 'Approval blocked: another approved, confirmed, or active rental overlaps these dates.', rentals }
  }
  const at = new Date().toISOString()
  const updated: Rental = { ...rental, status, history: [...historyForRental(rental), { id: crypto.randomUUID(), status, actor: role, at, reason: details.reason?.trim(), note: details.note?.trim() }] }
  if (details.check && status === 'Active') updated.pickupCheck = { ...details.check, at }
  if (details.check && status === 'Completed') updated.returnCheck = { ...details.check, at }
  return { error: '', rentals: rentals.map((r) => r.id === id ? updated : r) }
}
