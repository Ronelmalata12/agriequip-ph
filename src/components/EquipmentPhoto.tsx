import { t } from '../lib/language'
import type { Equipment } from '../types'
import { equipment as sampleEquipment } from '../data/equipment'
import { Icon } from './Icon'
import './EquipmentPhoto.css'

export function EquipmentPhoto({ item }: { item: Equipment }) {
  if (!item.photo && !sampleEquipment.some(sample => sample.id === item.id)) return <div className="equipment-photo equipment-photo-placeholder" role="img" aria-label={t(`${item.name} — photo not added`)}><Icon name="equipment" size={32} /><span>{t("Photo not added")}</span></div>
  const src = item.photo || `${import.meta.env.BASE_URL}images/equipment-v2/${item.id}.jpg`
  return <div className="equipment-photo" style={{ backgroundImage: `url("${src}")` }}>
    <img className="equipment-photo-subject" src={src} alt={`${item.name} — ${item.photo ? 'uploaded equipment photo' : 'AI-generated equipment image'}`} loading="lazy" decoding="async" width={768} height={512} />
  </div>
}
