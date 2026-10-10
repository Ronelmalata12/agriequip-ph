import type { FarmerInformation } from '../types'
import { createBrowserStore } from './browserStore'

export const defaultFarmer: FarmerInformation = { name: 'Ka-Farmer', contact: '', barangay: '', farmLocation: '' }
export function isFarmerInformation(value: unknown): value is FarmerInformation {
  if (!value || typeof value !== 'object') return false
  const p = value as Record<string, unknown>
  return ['name', 'contact', 'barangay', 'farmLocation'].every(key => typeof p[key] === 'string' && (p[key] as string).length <= 250)
}
export function validateFarmer(profile: FarmerInformation) {
  if (!profile.name.trim() || !profile.barangay.trim() || !profile.farmLocation.trim()) return 'Enter your name, barangay, and farm location.'
  if (!/^(09\d{9}|\+639\d{9})$/.test(profile.contact.replace(/[\s-]/g, ''))) return 'Enter a Philippine mobile number, such as 09123456789 or +639123456789.'
  return ''
}
const store = createBrowserStore('agriequip-ph.profile.v1', defaultFarmer, isFarmerInformation)
export const useProfileStore = store.useStore
export function saveFarmerProfile(profile: FarmerInformation) {
  const clean = Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, value.trim()])) as unknown as FarmerInformation
  return validateFarmer(clean) || store.save(clean)
}
