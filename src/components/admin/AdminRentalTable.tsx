import { t } from '../../lib/language'
import type { Rental } from '../../types'
import { equipmentForRental } from '../../lib/equipmentStore'
import { dateLabel, money } from '../../lib/rentals'
import { StatusBadge } from '../RentalList'
import { EquipmentPhoto } from '../EquipmentPhoto'
import { rentalDueState } from '../../lib/rentalActivity'

export function AdminRentalTable({ rentals, onView }: { rentals: Rental[]; onView: (id: string) => void }) {
  if (!rentals.length) return <div className="empty-state admin-empty"><h2>{t("No matching records")}</h2><p>{t("Requests submitted through the farmer mobile module will appear here. Try another filter if records are already saved.")}</p></div>
  return <div className="admin-table-scroll" role="region" aria-label={t("Rental records")} tabIndex={0}>
    <table className="admin-table">
      <caption className="sr-only">{t("Rental records from the farmer mobile module")}</caption>
      <thead><tr><th scope="col">{t("Request / equipment")}</th><th scope="col">{t("Farmer")}</th><th scope="col">{t("Rental dates")}</th><th scope="col">{t("Status")}</th><th scope="col">{t("Estimate")}</th><th scope="col">{t("Details")}</th></tr></thead>
      <tbody>{rentals.map((rental) => {
        const item = equipmentForRental(rental)
        return <tr key={rental.id}>
          <td><div className="admin-equipment-cell"><div className="admin-equipment-thumbnail"><EquipmentPhoto item={item} /></div><div className="admin-equipment-meta"><strong>{item.name}</strong><span>{rental.id.slice(-8).toUpperCase()}{t(" · ")}{t(item.category)}</span><span>{item.owner}</span></div></div></td>
          <td><strong>{rental.farmer?.name || 'Ka-Farmer'}</strong><span>{rental.farmer?.contact || 'Contact not recorded'}</span></td>
          <td>{dateLabel(rental.startDate)}<span>{t("to ")}{dateLabel(rental.endDate)}</span>{rentalDueState(rental) && <span className="rental-due-badge">{t(rentalDueState(rental)!)}</span>}</td>
          <td><StatusBadge status={rental.status} /></td>
          <td><strong>{money(rental.total)}</strong><span>{t("No payment collected")}</span></td>
          <td><button className="text-button" aria-label={t(`Review request ${rental.id.slice(-8).toUpperCase()}`)} onClick={() => onView(rental.id)}>{t("Review")}</button></td>
        </tr>
      })}</tbody>
    </table>
  </div>
}
