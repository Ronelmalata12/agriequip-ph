import { useSyncExternalStore } from 'react'

// Small shared store for the Web view and the farmer iframe, using native storage events.
export function createBrowserStore<T>(key: string, fallback: T, validate: (value: unknown) => value is T) {
  function read() {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return { data: fallback, warning: '' }
      const value: unknown = JSON.parse(raw)
      if (!validate(value)) throw new Error('Invalid saved data')
      return { data: value, warning: '' }
    } catch {
      return { data: fallback, warning: 'Saved data could not be loaded. Showing the default information.' }
    }
  }
  let snapshot = read()
  const listeners = new Set<() => void>()
  function sync(event: StorageEvent) {
    if (event.key !== key && event.key !== null) return
    snapshot = read()
    listeners.forEach(listener => listener())
  }
  function subscribe(listener: () => void) {
    if (!listeners.size) window.addEventListener('storage', sync)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      if (!listeners.size) window.removeEventListener('storage', sync)
    }
  }
  return {
    get: () => snapshot.data,
    useStore: () => useSyncExternalStore(subscribe, () => snapshot),
    save(data: T) {
      if (!validate(data)) return 'Please check the information before saving.'
      try { localStorage.setItem(key, JSON.stringify(data)) }
      catch { return 'Could not save in this browser. Storage may be full or disabled. Try a smaller photo.' }
      snapshot = { data, warning: '' }
      listeners.forEach(listener => listener())
      return ''
    },
  }
}
