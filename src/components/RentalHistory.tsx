import type { HandoverCheck, Rental } from '../types'
import { historyForRental, rentalDueState } from '../lib/rentalActivity'
import { t, timestampLabel } from '../lib/language'

function CheckSummary({ title, check }: { title: string; check: HandoverCheck }) {
  return <section className="handover-summary"><h3>{t(title)}</h3><dl><div><dt>{t('Received by')}</dt><dd>{check.receivedBy} · {timestampLabel(check.at)}</dd></div><div><dt>{t('Equipment condition')}</dt><dd>{t(check.condition)}</dd></div><div><dt>{t('Accessories / inclusions')}</dt><dd>{check.accessories} · {t(check.accessoriesStatus)}</dd></div>{check.notes && <div><dt>{t('Condition / damage notes')}</dt><dd>{check.notes}</dd></div>}</dl></section>
}
export function RentalHistory({ rental }: { rental: Rental }) {
  const due = rentalDueState(rental)
  return <section className="rental-history"><h2>{t('Status history')}</h2>{due && <p className="overdue-note">{t(due)} · {t('Contact the owner or admin to arrange the return.')}</p>}<ol>{historyForRental(rental).map(event => <li key={event.id}><div><strong>{t(event.status)}</strong><span>{t(event.actor)} · {event.at ? timestampLabel(event.at) : t('Not recorded')}</span></div>{event.reason && <p><strong>{t('Reason')}: </strong>{event.reason}</p>}{event.note && <p>{event.actor === 'Imported record' ? t(event.note) : event.note}</p>}</li>)}</ol>{rental.pickupCheck && <CheckSummary title="Pickup checks" check={rental.pickupCheck} />}{rental.returnCheck && <CheckSummary title="Return checks" check={rental.returnCheck} />}</section>
}
