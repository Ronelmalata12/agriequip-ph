import { t } from '../lib/language'
import { equipment } from '../data/equipment'
import { dateLabel, money, rentalDays } from '../lib/rentals'
import type { Rental, RentalStatus } from '../types'
import { EquipmentArt } from './EquipmentArt'
import { Icon } from './Icon'

export function StatusBadge({ status }: { status: RentalStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{t(status)}</span>
}

export function RentalList({ rentals, owner = false, onStatus, onBrowse }: { rentals: Rental[]; owner?: boolean; onStatus: (id: string, status: RentalStatus) => void; onBrowse: () => void }) {
  if (!rentals.length) return <div className="empty-state"><span className="empty-icon"><Icon name="rentals" size={30} /></span><h3>{owner ? t('No incoming requests yet') : t('Your next harvest starts here')}</h3><p>{owner ? t('Create a request as a Farmer, then switch back here to manage it.') : t('Find the right equipment and send your first rental request.')}</p><button className="button primary" onClick={onBrowse}>{t("Browse equipment ")}<Icon name="arrow" size={18} /></button></div>
  return <div className="rental-list">{rentals.map((rental) => {
    const item = equipment.find((e) => e.id === rental.equipmentId)!
    return <article className="rental-card" key={rental.id}>
      <div className={`rental-thumbnail art-${item.art}`}><EquipmentArt kind={item.art} /></div>
      <div className="rental-info"><div className="rental-title"><h3>{item.name}</h3><StatusBadge status={rental.status} /></div><p className="rental-owner">{item.owner}</p><p className="rental-dates"><Icon name="calendar" size={16} />{dateLabel(rental.startDate)}{t(" — ")}{dateLabel(rental.endDate)}</p><p className="help-text">{rentalDays(rental.startDate, rental.endDate)}{t(" day(s) · ")}{rental.pickup}{t(" · Request ")}{rental.id.slice(-8).toUpperCase()}</p></div>
      <div className="rental-side"><strong className="rental-total">{money(rental.total)}</strong><span className="help-text">{money(rental.dailyRate)}{t(" / day")}{rental.deliveryFee > 0 ? t(` + ${money(rental.deliveryFee)} delivery`) : t('')}</span>
        <div className="rental-actions">
          {owner && rental.status === 'Pending' && <><button className="button small primary" onClick={() => onStatus(rental.id, 'Approved')}>{t("Approve")}</button><button className="button small secondary danger" onClick={() => onStatus(rental.id, 'Rejected')}>{t("Reject")}</button></>}
          {owner && rental.status === 'Approved' && <span className="help-text">{t("Awaiting farmer confirmation")}</span>}
          {owner && rental.status === 'Confirmed' && <button className="button small primary" onClick={() => onStatus(rental.id, 'Active')}>{t("Confirm pickup")}</button>}
          {owner && rental.status === 'Active' && <button className="button small primary" onClick={() => onStatus(rental.id, 'Completed')}>{t("Confirm return")}</button>}
          {!owner && rental.status === 'Approved' && <button className="button small primary" onClick={() => onStatus(rental.id, 'Confirmed')}>{t("Confirm booking")}</button>}
          {!owner && ['Pending', 'Approved', 'Confirmed'].includes(rental.status) && <button className="button small secondary" onClick={() => onStatus(rental.id, 'Cancelled')}>{rental.status === 'Pending' ? t('Cancel request') : t('Cancel booking')}</button>}
        </div>
      </div>
    </article>
  })}</div>
}
