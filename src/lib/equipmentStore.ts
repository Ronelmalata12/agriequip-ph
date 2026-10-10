import { categories, equipment as sampleEquipment } from '../data/equipment'
import type { Equipment, Rental } from '../types'
import { createBrowserStore } from './browserStore'
import { ownerForEquipment } from './ownerStore'

const artKinds = new Set(sampleEquipment.map(item => item.art))
export function isEquipment(value: unknown): value is Equipment {
  if (!value || typeof value !== 'object') return false
  const e = value as Equipment
  return ['id', 'name', 'owner', 'location', 'description'].every(key => typeof (e as unknown as Record<string, unknown>)[key] === 'string' && !!String((e as unknown as Record<string, unknown>)[key]).trim())
    && categories.includes(e.category) && artKinds.has(e.art)
    && Number.isFinite(e.rate) && e.rate > 0 && Number.isFinite(e.deliveryFee) && e.deliveryFee >= 0
    && typeof e.available === 'boolean' && Array.isArray(e.specs) && e.specs.every(s => typeof s === 'string')
    && (e.photo === undefined || (typeof e.photo === 'string' && e.photo.length <= 1_500_000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(e.photo)))
    && (e.photoLabel === undefined || typeof e.photoLabel === 'string') && (e.ownerId === undefined || typeof e.ownerId === 'string')
}
function isCatalog(value: unknown): value is Equipment[] {
  return Array.isArray(value) && value.every(isEquipment) && new Set(value.map(e => e.id)).size === value.length
    && sampleEquipment.every(sample => value.some(e => e.id === sample.id))
}
const store = createBrowserStore('agriequip-ph.equipment.v1', sampleEquipment, isCatalog)
// Older saved listings and request snapshots can still contain the former sample wording.
function displayEquipment(item: Equipment): Equipment {
  const clean = (text: string) => text.replaceAll('for this demo listing', 'for this listing').replaceAll('for the demo rental', 'for the rental').replaceAll('Maintenance · unavailable in demo', 'Maintenance · unavailable')
  const owner = ownerForEquipment(item)
  return { ...item, ownerId: owner?.id ?? item.ownerId, owner: owner?.name ?? item.owner, description: clean(item.description), specs: item.specs.map(clean) }
}
export function useEquipmentStore() {
  const snapshot = store.useStore()
  return { data: snapshot.data.map(displayEquipment), warning: snapshot.warning }
}
export function getEquipment() { return store.get().map(displayEquipment) }
export function saveEquipment(item: Equipment) {
  const current = store.get()
  return store.save(current.some(e => e.id === item.id) ? current.map(e => e.id === item.id ? item : e) : [...current, item])
}
export function equipmentForRental(rental: Rental, catalog = store.get()) {
  // Historical names stay as submitted even when the linked owner record is renamed.
  const item = rental.equipmentSnapshot ?? catalog.find(item => item.id === rental.equipmentId)!
  const display = displayEquipment(item)
  return rental.equipmentSnapshot ? { ...display, owner: item.owner } : display
}
