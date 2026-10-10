import { useState } from 'react'
import type { Rental, Role } from '../types'
import { useNotifications } from '../lib/notifications'
import { equipmentForRental } from '../lib/equipmentStore'
import { dateLabel } from '../lib/rentals'
import { t, timestampLabel } from '../lib/language'

export function NotificationList({ rentals, role, onView }: { rentals: Rental[]; role: Role; onView: (id: string) => void }) {
  const { notifications, unread, markRead, warning } = useNotifications(rentals, role)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [error, setError] = useState('')
  const visible = unreadOnly ? notifications.filter(item => !item.read) : notifications
  return <section className="notification-center"><div className="section-heading"><h1>{t('Notifications')}</h1><button className="text-button" disabled={!unread} onClick={() => setError(markRead(notifications.map(item => item.id)))}>{t('Mark all as read')}</button></div><p className="help-text">{t('In-app updates only. Email, SMS, and push delivery are not connected.')}</p><label className="notification-filter"><input type="checkbox" checked={unreadOnly} onChange={event => setUnreadOnly(event.target.checked)} />{t('Unread')}</label>{(error || warning) && <p className="form-error" role="alert">{t(error || warning)}</p>}<div className="notification-list">{visible.map(notification => {
    const rental = rentals.find(item => item.id === notification.rentalId)!
    return <article key={notification.id} className={`notification-card ${notification.read ? '' : 'is-unread'}`}><span className="notification-state">{t(notification.read ? 'Read' : 'Unread')}</span><h2>{t(notification.title)}</h2><p>{equipmentForRental(rental).name} · {rental.id.slice(-8).toUpperCase()}</p><time>{notification.due ? dateLabel(rental.endDate) : notification.at ? timestampLabel(notification.at) : t('Not recorded')}</time>{notification.reason && <p>{notification.reason}</p>}{notification.due && <p>{t(notification.due)}</p>}<div><button className="text-button" onClick={() => { setError(markRead([notification.id])); onView(rental.id) }}>{t('View rental')}</button>{!notification.read && <button className="text-button" onClick={() => setError(markRead([notification.id]))}>{t('Mark as read')}</button>}</div></article>
  })}</div>{!visible.length && <div className="empty-state"><h2>{t('No notifications yet')}</h2></div>}</section>
}
