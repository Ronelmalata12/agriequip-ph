import { t } from '../lib/language'
import type { Equipment } from '../types'
import { money } from '../lib/rentals'
import { EquipmentArt } from './EquipmentArt'
import { EquipmentPhoto } from './EquipmentPhoto'
import { Icon } from './Icon'

export function EquipmentCard({ item, onView, realistic = false }: { item: Equipment; onView: (item: Equipment) => void; realistic?: boolean }) {
  return <article className="equipment-card">
    <div className={`equipment-picture art-${item.art}`}>
      <span className={`availability ${item.available ? '' : 'unavailable'}`}><span />{item.available ? t('Available') : t('Unavailable')}</span>
      {realistic ? <EquipmentPhoto item={item} /> : <EquipmentArt kind={item.art} />}
    </div>
    <div className="equipment-body">
      <p className="eyebrow muted">{t(item.category)}</p>
      <h3>{item.name}</h3>
      <p className="location"><Icon name="pin" size={15} />{item.location}</p>
      <div className="card-bottom"><p><strong>{money(item.rate)}</strong><span>{t(" / day")}</span></p><button className="text-button" onClick={() => onView(item)} aria-label={t(`View details for ${item.name}`)}>{t("View details ")}<Icon name="arrow" size={17} /></button></div>
    </div>
  </article>
}
