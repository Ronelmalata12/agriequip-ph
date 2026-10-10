import { getEquipment, isEquipment } from './equipmentStore'
import { isFarmerInformation } from './profileStore'
import { isHandoverCheck, isRentalEvent } from './rentalActivity'
import { getLanguage } from './language'
import type { Rental, RentalStatus } from '../types'

export const STORAGE_KEY = 'agriequip-ph.rentals.v1'
const statuses: RentalStatus[] = ['Pending', 'Approved', 'Confirmed', 'Active', 'Completed', 'Rejected', 'Cancelled']
const dayMs = 86_400_000

export function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Parse date-only values as UTC solely for calendar arithmetic, avoiding DST drift.
export function calendarDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN
  const time = Date.parse(`${value}T00:00:00Z`)
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) return NaN
  return time / dayMs
}

export function rentalDays(start: string, end: string) {
  const count = calendarDay(end) - calendarDay(start) + 1
  return Number.isFinite(count) && count > 0 ? count : 0
}

export function validateDates(start: string, end: string) {
  if (!Number.isFinite(calendarDay(start)) || !Number.isFinite(calendarDay(end))) return 'Choose valid start and end dates.'
  if (calendarDay(start) < calendarDay(today())) return 'The start date cannot be in the past.'
  if (calendarDay(end) < calendarDay(start)) return 'The end date must be on or after the start date.'
  return ''
}

export function overlaps(rentals: Rental[], equipmentId: string, start: string, end: string, exceptId?: string) {
  return rentals.some((rental) => rental.id !== exceptId && rental.equipmentId === equipmentId
    && ['Approved', 'Confirmed', 'Active'].includes(rental.status)
    && calendarDay(start) <= calendarDay(rental.endDate) && calendarDay(end) >= calendarDay(rental.startDate))
}

export function money(amount: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount)
}

export function dateLabel(value: string) {
  return new Intl.DateTimeFormat(getLanguage() === 'fil' ? 'fil-PH' : 'en-PH', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

function isRental(value: unknown): value is Rental {
  if (!value || typeof value !== 'object') return false
  const r = value as Record<string, unknown>
  return typeof r.id === 'string' && typeof r.equipmentId === 'string' && (getEquipment().some((e) => e.id === r.equipmentId) || (isEquipment(r.equipmentSnapshot) && r.equipmentSnapshot.id === r.equipmentId))
    && typeof r.startDate === 'string' && typeof r.endDate === 'string' && rentalDays(r.startDate, r.endDate) > 0
    && (r.pickup === 'Self pickup' || r.pickup === 'Owner delivery')
    && typeof r.dailyRate === 'number' && Number.isFinite(r.dailyRate) && r.dailyRate >= 0
    && typeof r.deliveryFee === 'number' && Number.isFinite(r.deliveryFee) && r.deliveryFee >= 0
    && typeof r.total === 'number' && r.total === rentalDays(r.startDate, r.endDate) * r.dailyRate + r.deliveryFee
    && typeof r.status === 'string' && statuses.includes(r.status as RentalStatus)
    && typeof r.createdAt === 'string' && Number.isFinite(Date.parse(r.createdAt))
    && (r.farmer === undefined || isFarmerInformation(r.farmer))
    && (r.equipmentSnapshot === undefined || (isEquipment(r.equipmentSnapshot) && r.equipmentSnapshot.id === r.equipmentId))
    && (r.notes === undefined || (typeof r.notes === 'string' && r.notes.length <= 600))
    && (r.delivery === undefined || (!!r.delivery && typeof r.delivery === 'object' && ['address', 'landmark', 'preferredTime'].every(key => typeof (r.delivery as Record<string, unknown>)[key] === 'string')))
    && (r.history === undefined || (Array.isArray(r.history) && r.history.length > 0 && r.history.every(isRentalEvent) && new Set(r.history.map(event => event.id)).size === r.history.length && r.history.at(-1)?.status === r.status))
    && (r.pickupCheck === undefined || isHandoverCheck(r.pickupCheck))
    && (r.returnCheck === undefined || isHandoverCheck(r.returnCheck))
}

export function loadRentals(): { rentals: Rental[]; warning: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { rentals: [], warning: '' }
    const saved: unknown = JSON.parse(raw)
    if (!saved || typeof saved !== 'object') throw new Error('Invalid storage')
    const data = saved as Record<string, unknown>
    if (data.version !== 1 || !Array.isArray(data.rentals) || !data.rentals.every(isRental)) throw new Error('Invalid storage')
    if (new Set(data.rentals.map((r) => r.id)).size !== data.rentals.length) throw new Error('Duplicate rentals')
    return { rentals: data.rentals, warning: '' }
  } catch {
    return { rentals: [], warning: 'Saved rental data could not be loaded. New requests will replace it. This browser may also have storage disabled.' }
  }
}

export function saveRentals(rentals: Rental[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, rentals }))
    return ''
  } catch {
    return 'Browser storage is unavailable. Changes work for this session but will not survive refresh.'
  }
}
