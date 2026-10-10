export type Page = 'Dashboard' | 'Rental Requests' | 'Transactions' | 'Equipment Management' | 'Owners & Cooperatives' | 'Notifications'
export type Role = 'Farmer' | 'Admin'
export type Category = 'Land preparation' | 'Crop care' | 'Irrigation' | 'Harvesting' | 'Transport' | 'Hand tools'
export type RentalStatus = 'Pending' | 'Approved' | 'Confirmed' | 'Active' | 'Completed' | 'Rejected' | 'Cancelled'
export type PickupMethod = 'Self pickup' | 'Owner delivery'

export interface Equipment {
  id: string
  name: string
  category: Category
  owner: string
  ownerId?: string
  location: string
  rate: number
  deliveryFee: number
  available: boolean
  description: string
  specs: string[]
  art: 'tractor' | 'tiller' | 'sprayer' | 'pump' | 'farm-tractor' | 'harvester' | 'thresher' | 'trailer' | 'wheelbarrow' | 'cutter' | 'hoe' | 'rake' | 'shovel' | 'bolo' | 'sickle'
  photo?: string
  photoLabel?: string
}

export interface FarmerInformation {
  name: string
  contact: string
  barangay: string
  farmLocation: string
}

export interface DeliveryDetails {
  address: string
  landmark: string
  preferredTime: string
}

export interface Rental {
  id: string
  equipmentId: string
  startDate: string
  endDate: string
  pickup: PickupMethod
  dailyRate: number
  deliveryFee: number
  total: number
  status: RentalStatus
  createdAt: string
  // Optional for compatibility with requests saved before these features existed.
  farmer?: FarmerInformation
  delivery?: DeliveryDetails
  notes?: string
  equipmentSnapshot?: Equipment
  history?: RentalEvent[]
  pickupCheck?: HandoverCheck
  returnCheck?: HandoverCheck
}

export interface OwnerRecord {
  id: string
  name: string
  kind: 'Equipment owner' | 'Cooperative'
  contactPerson: string
  phone: string
  location: string
  notes: string
  aliases?: string[]
}

export interface RentalEvent {
  id: string
  status: RentalStatus
  actor: Role | 'Imported record'
  at?: string
  reason?: string
  note?: string
}

export interface HandoverCheck {
  at: string
  receivedBy: string
  condition: 'Good' | 'Worn' | 'Damaged'
  accessories: string
  accessoriesStatus: 'All accounted for' | 'Missing items'
  inspectionConfirmed: boolean
  safetyBriefing: boolean
  notes: string
}

export interface TransitionDetails {
  reason?: string
  note?: string
  check?: Omit<HandoverCheck, 'at'>
}
