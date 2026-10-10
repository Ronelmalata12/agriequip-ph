import type { Equipment, OwnerRecord } from '../types'
import { equipment as samples } from '../data/equipment'
import { createBrowserStore } from './browserStore'

const defaults: OwnerRecord[] = [...new Set(samples.map(item => item.owner))].map((name, index) => ({
  id: `owner-${index + 1}`, name, kind: name.includes('Cooperative') ? 'Cooperative' : 'Equipment owner', contactPerson: '', phone: '', location: samples.find(item => item.owner === name)!.location, notes: 'Fictional sample record.',
}))
function isOwners(value: unknown): value is OwnerRecord[] {
  return Array.isArray(value) && new Set(value.map(record => record?.id)).size === value.length && value.every(record => record && ['id', 'name', 'contactPerson', 'phone', 'location', 'notes'].every(key => typeof record[key] === 'string' && record[key].length <= 600) && record.id && record.name.trim() && ['Equipment owner', 'Cooperative'].includes(record.kind) && (record.aliases === undefined || (Array.isArray(record.aliases) && record.aliases.every((alias: unknown) => typeof alias === 'string'))))
}
const store = createBrowserStore('agriequip-ph.owners.v1', defaults, isOwners)
export const useOwnerStore = store.useStore
export const getOwners = store.get
export function ownerForEquipment(item: Equipment) { return store.get().find(owner => item.ownerId ? owner.id === item.ownerId : owner.name === item.owner || owner.aliases?.includes(item.owner)) }
export function saveOwner(record: OwnerRecord) {
  const clean = { ...record, name: record.name.trim(), contactPerson: record.contactPerson.trim(), phone: record.phone.trim(), location: record.location.trim(), notes: record.notes.trim() }
  if (!clean.name || !clean.contactPerson || !clean.location) return 'Enter the owner name, contact person, and location.'
  if (!/^(09\d{9}|\+639\d{9})$/.test(clean.phone.replace(/[\s-]/g, ''))) return 'Enter a valid Philippine mobile number.'
  const owners = store.get()
  const previous = owners.find(owner => owner.id === clean.id)
  clean.aliases = [...new Set([...(previous?.aliases ?? []), ...(previous && previous.name !== clean.name ? [previous.name] : [])])]
  if (owners.some(owner => owner.id !== clean.id && owner.name.toLowerCase() === clean.name.toLowerCase())) return 'An owner with this name already exists.'
  return store.save(owners.some(owner => owner.id === clean.id) ? owners.map(owner => owner.id === clean.id ? clean : owner) : [...owners, clean])
}
