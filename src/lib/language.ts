import { useEffect } from 'react'
import { createBrowserStore } from './browserStore'
import { filipino } from '../data/filipino'

export type Language = 'en' | 'fil'
const store = createBrowserStore<Language>('agriequip-ph.language.v1', 'en', (value): value is Language => value === 'en' || value === 'fil')
export const getLanguage = store.get
export const setLanguage = store.save
export function useLanguage() {
  const snapshot = store.useStore()
  useEffect(() => { document.documentElement.lang = snapshot.data === 'fil' ? 'fil' : 'en' }, [snapshot.data])
  return snapshot
}
export function t(text: string) {
  if (getLanguage() === 'en') return text
  const key = text.trim()
  let translated = filipino[key]
  if (!translated) {
    const prefixes: [string, string][] = [['View details for ', 'Tingnan ang detalye ng '], ['View rental for ', 'Tingnan ang renta ng '], ['Review request ', 'Suriin ang kahilingan '], ['Edit ', 'I-edit ang '], ['Collect from ', 'Kunin sa '], ['Reference ', 'Sanggunian '], ['No ', 'Walang ']]
    const prefix = prefixes.find(([english]) => key.startsWith(english))
    translated = prefix ? prefix[1] + key.slice(prefix[0].length) : key.replace(/\bday\(s\)|\bdays?\b/g, 'araw').replace(/per day/g, 'bawat araw')
  }
  return `${text.startsWith(' ') ? ' ' : ''}${translated}${text.endsWith(' ') ? ' ' : ''}`
}
export function timestampLabel(value: string) {
  return new Date(value).toLocaleString(getLanguage() === 'fil' ? 'fil-PH' : 'en-PH')
}
