import { t } from '../../lib/language'
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Category, Equipment } from '../../types'
import { categories } from '../../data/equipment'
import { isEquipment, saveEquipment, useEquipmentStore } from '../../lib/equipmentStore'
import { money } from '../../lib/rentals'
import { EquipmentPhoto } from '../EquipmentPhoto'
import { Icon } from '../Icon'
import { Modal } from '../Modal'
import { useOwnerStore } from '../../lib/ownerStore'

function newListing(): Equipment {
  return { id: crypto.randomUUID(), name: '', category: 'Hand tools', owner: '', location: '', description: '', rate: 50, deliveryFee: 0, available: true, specs: [], art: 'hoe' }
}

function EquipmentEditor({ item, onClose, onSaved }: { item: Equipment; onClose: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState(item)
  const { data: owners } = useOwnerStore()
  const [specs, setSpecs] = useState(item.specs.join('\n'))
  const [error, setError] = useState('')
  const [readingPhoto, setReadingPhoto] = useState(false)
  function field<K extends keyof Equipment>(key: K, value: Equipment[K]) { setDraft(current => ({ ...current, [key]: value })) }
  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1_000_000) {
      setError('Choose a JPG, PNG, or WebP image smaller than 1 MB.'); event.target.value = ''; return
    }
    setReadingPhoto(true); setError('')
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => { setDraft(current => ({ ...current, photo: String(reader.result), photoLabel: file.name })); setReadingPhoto(false) }
      image.onerror = () => { setError('This file could not be opened as an image.'); setReadingPhoto(false) }
      image.src = String(reader.result)
    }
    reader.onerror = () => { setError('The photo could not be read. Try another file.'); setReadingPhoto(false) }
    reader.readAsDataURL(file)
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const owner = owners.find(record => record.id === draft.ownerId)
    if (!owner) { setError('Select an owner or cooperative record. Create one in Owners & Cooperatives if needed.'); return }
    const clean = { ...draft, owner: owner.name, name: draft.name.trim(), location: draft.location.trim(), description: draft.description.trim(), specs: specs.split('\n').map(s => s.trim()).filter(Boolean) }
    if (!isEquipment(clean)) { setError('Complete all required fields. Daily rate must be greater than zero and delivery fee cannot be negative.'); return }
    const result = saveEquipment(clean)
    if (result) { setError(result); return }
    onSaved()
  }
  return <Modal title={t(item.name ? 'Edit equipment' : 'Add equipment')} onClose={onClose}>
    <form className="equipment-editor" noValidate onSubmit={save}>
      <p className="help-text">{t("Changes appear in the farmer mobile catalog. Existing requests keep their submitted details and price.")}</p>
      <div className="equipment-editor-photo"><EquipmentPhoto item={draft} /></div>
      <label>{t("Equipment photo")}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} /></label>
      <p className="help-text">{t("JPG, PNG, or WebP · Up to 1 MB · Stored in this browser. ")}{draft.photoLabel}</p>
      {draft.photo && <button type="button" className="text-button" disabled={readingPhoto} onClick={() => setDraft(current => ({ ...current, photo: undefined, photoLabel: undefined }))}>{t("Remove uploaded photo")}</button>}
      <div className="equipment-editor-grid">
        <label>{t("Equipment name")}<input maxLength={100} required value={draft.name} onChange={e => field('name', e.target.value)} /></label>
        <label>{t("Category")}<select aria-label={t("Category")} value={draft.category} onChange={e => field('category', e.target.value as Category)}>{categories.map(category => <option value={category} key={category}>{t(category)}</option>)}</select></label>
        <label>{t("Owner / cooperative")}<select aria-label={t("Owner / cooperative")} required value={draft.ownerId || ''} onChange={event => field('ownerId', event.target.value)}><option value="">{t("Choose an owner record")}</option>{owners.map(owner => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select></label>
        <label>{t("Equipment location")}<input maxLength={200} required placeholder={t("Barangay, Nasugbu")} value={draft.location} onChange={e => field('location', e.target.value)} /></label>
        <label>{t("Daily rate (₱)")}<input type="number" min="0.01" step="0.01" required value={Number.isNaN(draft.rate) ? '' : draft.rate} onChange={e => field('rate', e.target.valueAsNumber)} /></label>
        <label>{t("Delivery fee (₱)")}<input type="number" min="0" step="0.01" required value={Number.isNaN(draft.deliveryFee) ? '' : draft.deliveryFee} onChange={e => field('deliveryFee', e.target.valueAsNumber)} /></label>
      </div>
      <label>{t("Availability")}<select aria-label={t("Availability")} value={draft.available ? 'Available' : 'Under maintenance'} onChange={e => field('available', e.target.value === 'Available')}><option value="Available">{t("Available")}</option><option value="Under maintenance">{t("Under maintenance")}</option></select></label>
      <p className="help-text">{t("Maintenance blocks new requests and approvals. Existing reservations still block overlapping dates.")}</p>
      <label>{t("Description")}<textarea aria-label={t("Description")} rows={3} maxLength={600} required value={draft.description} onChange={e => field('description', e.target.value)} /></label>
      <label>{t("Specifications / inclusions (one per line)")}<textarea aria-label={t("Specifications / inclusions (one per line)")} rows={4} maxLength={1000} value={specs} onChange={e => setSpecs(e.target.value)} /></label>
      {error && <p className="form-error" role="alert">{t(error)}</p>}
      <div className="form-actions"><button type="button" className="button secondary" onClick={onClose}>{t("Cancel")}</button><button className="button primary" type="submit" disabled={readingPhoto}>{readingPhoto ? t('Reading photo…') : t('Save equipment')}<Icon name="check" size={17} /></button></div>
    </form>
  </Modal>
}

export function EquipmentManagement() {
  const { data: equipment, warning } = useEquipmentStore()
  useOwnerStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | 'All categories'>('All categories')
  const [availability, setAvailability] = useState('All statuses')
  const [editing, setEditing] = useState<Equipment | null>(null)
  const [message, setMessage] = useState('')
  const visible = equipment.filter(item => `${item.name} ${item.owner} ${item.location}`.toLowerCase().includes(search.trim().toLowerCase()) && (category === 'All categories' || item.category === category) && (availability === 'All statuses' || item.available === (availability === 'Available')))
  return <>
    <div className="page-heading"><div><p className="eyebrow">{t("ADMIN EQUIPMENT CATALOG")}</p><h1>{t("Equipment management")}</h1><p>{t("Manage equipment listings, owners, rates, photos, and maintenance availability.")}</p></div><button className="button primary" onClick={() => { setMessage(''); setEditing(newListing()) }}>{t("Add equipment")}<Icon name="equipment" size={18} /></button></div>
    {warning && <p className="form-error" role="alert">{t(warning)}</p>}
    {message && <p className="notice" role="status">{t(message)}</p>}
    <p className="admin-info-note">{t("Changes sync to Mobile within this browser. Prices and availability are sample data. Each listing represents one rentable unit.")}</p>
    <div className="admin-record-filters equipment-management-filters">
      <label className="search-field"><Icon name="search" /><input type="search" aria-label={t("Search managed equipment")} placeholder={t("Search equipment, owner, or location…")} value={search} onChange={e => setSearch(e.target.value)} /></label>
      <label className="rental-filter">{t("Category")}<select aria-label={t("Managed equipment category")} value={category} onChange={e => setCategory(e.target.value as Category | 'All categories')}><option value="All categories">{t("All categories")}</option>{categories.map(c => <option value={c} key={c}>{t(c)}</option>)}</select></label>
      <label className="rental-filter">{t("Availability")}<select aria-label={t("Managed equipment availability")} value={availability} onChange={e => setAvailability(e.target.value)}><option value="All statuses">{t("All statuses")}</option><option value="Available">{t("Available")}</option><option value="Under maintenance">{t("Under maintenance")}</option></select></label>
    </div>
    <p className="result-count" role="status">{t("Showing ")}{visible.length}{t(" of ")}{equipment.length}{t(" listings")}</p>
    <div className="managed-equipment-grid">{visible.map(item => <article className="panel managed-equipment-card" key={item.id}>
      <div className="managed-equipment-photo"><EquipmentPhoto item={item} /></div><div className="managed-equipment-info"><p className="eyebrow">{t(item.category)}</p><h2>{item.name}</h2><p>{item.owner}</p><p>{item.location}</p><strong>{money(item.rate)}{t(" / day")}</strong><span className={`availability ${item.available ? '' : 'unavailable'}`}><span />{item.available ? t('Available') : t('Maintenance')}</span><button className="button secondary" aria-label={t(`Edit ${item.name}`)} onClick={() => { setMessage(''); setEditing(item) }}>{t("Edit equipment")}</button></div>
    </article>)}</div>
    {!visible.length && <div className="empty-state"><h2>{t("No matching listings")}</h2><p>{t("Try another search or filter.")}</p></div>}
    {editing && <EquipmentEditor item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage('Equipment saved. The farmer mobile catalog has been updated.') }} />}
  </>
}
