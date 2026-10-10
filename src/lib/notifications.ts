import { useEffect, useState } from 'react'
import type { Rental, RentalStatus, Role } from '../types'
import { createBrowserStore } from './browserStore'
import { historyForRental, rentalDueState } from './rentalActivity'
import { today } from './rentals'

const readStore = createBrowserStore<string[]>('agriequip-ph.notifications-read.v1', [], (value): value is string[] => Array.isArray(value) && value.every(id => typeof id === 'string'))
export interface RentalNotification { id: string; rentalId: string; title: string; at?: string; reason?: string; due?: string; status: RentalStatus; read: boolean }
const titles: Record<RentalStatus, string> = { Pending: 'Request submitted', Approved: 'Request approved', Confirmed: 'Booking confirmed', Active: 'Equipment picked up', Completed: 'Equipment returned', Rejected: 'Request rejected', Cancelled: 'Rental cancelled' }
export function useNotifications(rentals: Rental[], role: Role) {
  const { data: readIds, warning } = readStore.useStore()
  const [date, setDate] = useState(today())
  useEffect(() => { const timer = window.setInterval(() => setDate(today()), 60000); return () => window.clearInterval(timer) }, [])
  const notifications: RentalNotification[] = []
  for (const rental of rentals) {
    for (const event of historyForRental(rental)) {
      if (role === 'Admin' && !['Pending', 'Confirmed', 'Cancelled'].includes(event.status)) continue
      const id = `${role}:${event.id}`
      notifications.push({ id, rentalId: rental.id, title: titles[event.status], at: event.at, reason: event.reason, status: event.status, read: readIds.includes(id) })
    }
    const due = rentalDueState(rental, date)
    if (due) {
      const id = `${role}:${rental.id}:${due}:${date}`
      notifications.push({ id, rentalId: rental.id, title: due === 'Overdue' ? 'Return overdue' : 'Return reminder', due, status: rental.status, read: readIds.includes(id) })
    }
  }
  const order = (item: RentalNotification) => item.due ? Number.MAX_SAFE_INTEGER : item.at ? Date.parse(item.at) : 0
  notifications.sort((a, b) => order(b) - order(a))
  return { notifications, warning, unread: notifications.filter(item => !item.read).length, markRead: (ids: string[]) => readStore.save([...new Set([...readIds, ...ids])]) }
}
