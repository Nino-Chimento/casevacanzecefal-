export type VacationHome = {
  id: string
  name: string
  location: string
  address: string
  mapQuery?: string
  mapLat: number
  mapLng: number
  description: string
  highlights: string[]
  coverImage: string
  galleryImages?: string[]
  bookingUrl: string
}
