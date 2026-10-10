import { useState } from 'react'
import type { FormEvent } from 'react'
import type { OwnerRecord } from '../../types'
import { saveOwner, useOwnerStore } from '../../lib/ownerStore'
import { useEquipmentStore } from '../../lib/equipmentStore'
import { t } from '../../lib/language'
import { Modal } from '../Modal'

function OwnerEditor({ owner, onClose, onSaved }: { owner: OwnerRecord; onClose: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState(owner)
  const [error, setError] = useState('')
  function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const result = saveOwner(draft); if (result) setError(result); else onSaved() }
  return <Modal title={t(owner.name ? 'Edit owner / cooperative' : 'Add owner / cooperative')} onClose={onClose}><form className="equipment-editor" noValidate onSubmit={save}>
    <label>{t('Owner / cooperative name')}<input aria-label={t('Owner / cooperative name')} maxLength={150} value={draft.name} required onChange={event => setDraft({ ...draft, name: event.target.value })} /></label>
    <label>{t('Record type')}<select aria-label={t('Record type')} value={draft.kind} onChange={event => setDraft({ ...draft, kind: event.target.value as OwnerRecord['kind'] })}>{['Equipment owner', 'Cooperative'].map(kind => <option key={kind} value={kind}>{t(kind)}</option>)}</select></label>
    <label>{t('Contact person')}<input aria-label={t('Contact person')} maxLength={100} required value={draft.contactPerson} onChange={event => setDraft({ ...draft, contactPerson: event.target.value })} /></label>
    <label>{t('Contact number')}<input aria-label={t('Contact number')} type="tel" maxLength={20} required value={draft.phone} onChange={event => setDraft({ ...draft, phone: event.target.value })} /></label>
    <label>{t('Location')}<input aria-label={t('Location')} maxLength={200} required value={draft.location} onChange={event => setDraft({ ...draft, location: event.target.value })} /></label>
    <label>{t('Notes (optional)')}<textarea aria-label={t('Notes (optional)')} rows={3} maxLength={600} value={draft.notes} onChange={event => setDraft({ ...draft, notes: event.target.value })} /></label>
    {error && <p className="form-error" role="alert">{t(error)}</p>}<div className="form-actions"><button type="button" className="button secondary" onClick={onClose}>{t('Cancel')}</button><button className="button primary" type="submit">{t('Save owner record')}</button></div>
  </form></Modal>
}
export function OwnerRecords() {
  const { data: owners, warning } = useOwnerStore()
  const { data: equipment } = useEquipmentStore()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<OwnerRecord | null>(null)
  const [message, setMessage] = useState('')
  const visible = owners.filter(owner => `${owner.name} ${owner.kind} ${t(owner.kind)} ${owner.contactPerson} ${owner.location}`.toLowerCase().includes(search.trim().toLowerCase()))
  return <><div className="page-heading"><div><p className="eyebrow">{t('Owner records')}</p><h1>{t('Owners & Cooperatives')}</h1></div><button className="button primary" onClick={() => setEditing({ id: crypto.randomUUID(), name: '', kind: 'Equipment owner', contactPerson: '', phone: '', location: '', notes: '' })}>{t('Add owner / cooperative')}</button></div><p className="admin-info-note">{t('Assign equipment to these records in Equipment Management. Sample contact details are blank until entered.')}</p><label className="search-field owner-search"><input aria-label={t('Search owners')} type="search" placeholder={t('Search owners')} value={search} onChange={event => setSearch(event.target.value)} /></label>{warning && <p className="form-error" role="alert">{t(warning)}</p>}{message && <p className="notice" role="status">{t(message)}</p>}<div className="owner-record-grid">{visible.map(owner => <article className="panel owner-record-card" key={owner.id}><p className="eyebrow">{t(owner.kind)}</p><h2>{owner.name}</h2><p>{owner.contactPerson || t('Contact details not entered')}</p><p>{owner.phone}</p><p>{owner.location}</p>{owner.notes && <p>{owner.notes}</p>}<h3>{t('Assigned equipment')}</h3><ul>{equipment.filter(item => item.ownerId === owner.id).map(item => <li key={item.id}>{item.name}</li>)}</ul>{!equipment.some(item => item.ownerId === owner.id) && <p>{t('No equipment assigned yet.')}</p>}<button className="button secondary" aria-label={`${t('Edit record')}: ${owner.name}`} onClick={() => setEditing(owner)}>{t('Edit record')}</button></article>)}</div>{!visible.length && <div className="empty-state"><h2>{t('No matching records')}</h2></div>}{editing && <OwnerEditor owner={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage('Owner record saved.') }} />}</>
}
