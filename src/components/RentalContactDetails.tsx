import { t } from '../lib/language'
import type { DeliveryDetails, FarmerInformation, PickupMethod } from '../types'

export function RentalContactDetails({ farmer, delivery, pickup, notes }: { farmer?: FarmerInformation; delivery?: DeliveryDetails; pickup: PickupMethod; notes?: string }) {
  return <dl className="booking-summary rental-contact-details">
    <div><dt>{t("Farmer / contact")}</dt><dd>{farmer ? <>{farmer.name}<br />{farmer.contact}</> : t('Ka-Farmer · Contact not recorded')}</dd></div>
    {farmer && <><div><dt>{t("Barangay")}</dt><dd>{farmer.barangay}</dd></div><div><dt>{t("Farm location")}</dt><dd>{farmer.farmLocation}</dd></div></>}
    {pickup === 'Owner delivery' && <><div><dt>{t("Delivery address")}</dt><dd>{delivery?.address || t('Not recorded in this older request')}</dd></div><div><dt>{t("Landmark")}</dt><dd>{delivery?.landmark || t('None provided')}</dd></div><div><dt>{t("Preferred delivery time")}</dt><dd>{t(delivery?.preferredTime || 'Not recorded')}{t(" · Coordinate with admin")}</dd></div></>}
    {notes && <div><dt>{t("Rental notes")}</dt><dd>{notes}</dd></div>}
  </dl>
}
