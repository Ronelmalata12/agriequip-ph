import { useSyncExternalStore } from 'react'
import type { Rental } from '../types'
import { loadRentals, saveRentals, STORAGE_KEY } from './rentals'

// A shared browser store. Native storage events keep the phone iframe and web view connected.
let snapshot = loadRentals()
const listeners = new Set<() => void>()

function sync(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return
  snapshot = loadRentals()
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', sync)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', sync)
  }
}

function getSnapshot() { return snapshot }

export function useRentalStore() { return useSyncExternalStore(subscribe, getSnapshot) }

export function setDemoRentals(rentals: Rental[]) {
  snapshot = { rentals, warning: saveRentals(rentals) }
  listeners.forEach((listener) => listener())
}
