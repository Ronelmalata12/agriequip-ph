export type IconName = 'leaf' | 'dashboard' | 'equipment' | 'rentals' | 'owner' | 'pin' | 'search' | 'arrow' | 'menu' | 'close' | 'check' | 'clock' | 'calendar' | 'chevron' | 'phone' | 'monitor' | 'back' | 'tools' | 'truck' | 'harvest' | 'settings' | 'profile' | 'bell'

const paths: Record<IconName, string> = {
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  leaf: 'M20 3c-8-1-15 1-15 8a6 6 0 0 0 6 6c7 0 9-6 9-14ZM4 21l11-11M9 16v-5m0 5h5',
  dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  equipment: 'M3 12h12v6H3zM5 12V6h7v6m3 0h3l3 4v2h-6M7 18a2 2 0 1 0 0 .1M18 18a2 2 0 1 0 0 .1',
  rentals: 'M8 4H5v17h14V4h-3M8 3h8v4H8zM8 12h8M8 16h5',
  owner: 'M3 10l9-7 9 7M5 9v12h14V9M9 21v-7h6v7',
  pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M4 12h16M14 6l6 6-6 6',
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12l4 4L19 6',
  clock: 'M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  calendar: 'M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2',
  chevron: 'M9 5l7 7-7 7',
  phone: 'M7 2h10v20H7zM10 5h4M11 19h2',
  monitor: 'M2 3h20v14H2zM8 21h8M12 17v4',
  back: 'M20 12H4m6-6-6 6 6 6',
  tools: 'M5 3l14 18M3 6l6-5M19 3 5 21M15 2l6 5M16 4l3 3',
  truck: 'M2 5h12v12H2zM14 10h4l4 4v3h-8M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  harvest: 'M12 22V3m0 5c-5 0-7-3-7-5 5 0 7 3 7 5Zm0 5c5 0 7-3 7-5-5 0-7 3-7 5Zm0 5c-5 0-7-3-7-5 5 0 7 3 7 5Z',
  settings: 'M10 3h4l.6 2.5 2 .9L19 5l2 3.5-1.8 1.8v2.4L21 14.5 19 18l-2.4-1.4-2 .9L14 20h-4l-.6-2.5-2-.9L5 18l-2-3.5 1.8-1.8v-2.4L3 8.5 5 5l2.4 1.4 2-.9L10 3ZM15 11.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  profile: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2',
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
