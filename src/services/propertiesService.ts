import { fallbackVacationHomes } from '../data/properties'
import type { VacationHome } from '../types/property'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function mergeWithLocalOverrides(homes: VacationHome[]): VacationHome[] {
  const localById = new Map(fallbackVacationHomes.map((home) => [home.id, home]))

  return homes.map((home) => {
    const localHome = localById.get(home.id)
    if (!localHome) {
      return home
    }

    const localCoverIsAsset = localHome.coverImage.startsWith('/images/')
    const localGallery = localHome.galleryImages?.filter((image) =>
      image.startsWith('/images/'),
    )

    return {
      ...home,
      address: localHome.address || home.address,
      mapQuery: localHome.mapQuery || home.mapQuery,
      mapLat: localHome.mapLat ?? home.mapLat,
      mapLng: localHome.mapLng ?? home.mapLng,
      coverImage: localCoverIsAsset ? localHome.coverImage : home.coverImage,
      galleryImages:
        localGallery && localGallery.length > 0 ? localGallery : home.galleryImages,
    }
  })
}

export async function getVacationHomes(): Promise<VacationHome[]> {
  if (!API_BASE_URL) {
    return fallbackVacationHomes
  }

  const response = await fetch(`${API_BASE_URL}/vacation-homes`)

  if (!response.ok) {
    throw new Error('Impossibile caricare le abitazioni')
  }

  const apiHomes = (await response.json()) as VacationHome[]
  return mergeWithLocalOverrides(apiHomes)
}
