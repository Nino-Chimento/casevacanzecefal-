import { useEffect, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/styles.css'
import './App.css'
import { getVacationHomes } from './services/propertiesService'
import type { VacationHome } from './types/property'

type Language = 'it' | 'en'

const uiText = {
  it: {
    languageSelector: 'Selettore lingua',
    heroEyebrow: 'Case vacanze a Cefalù',
    heroTitle: 'Due abitazioni nel cuore della costa siciliana',
    heroText:
      'Scopri Casa Thalassa e Casa al Vecchio Molo: due soluzioni curate per soggiorni rilassanti tra mare, centro storico e autenticità.',
    heroCta: 'Scopri le abitazioni',
    loading: 'Caricamento abitazioni...',
    loadError: 'Non è stato possibile caricare le abitazioni al momento.',
    mapLabel: 'Posizione',
    openGallery: 'Apri galleria',
    photos: 'foto',
    booking: '🛎️ Vedi annuncio',
    openMaps: '🗺️ Apri in Maps',
    directions: '🚗 Ottieni indicazioni',
    closeGallery: 'Chiudi galleria',
    prevPhoto: 'Foto precedente',
    nextPhoto: 'Foto successiva',
    photo: 'Foto',
    of: 'di',
    keyboardHint: 'usa ← → per navigare, Esc per chiudere',
  },
  en: {
    languageSelector: 'Language selector',
    heroEyebrow: 'Vacation homes in Cefalù',
    heroTitle: 'Two homes in the heart of the Sicilian coast',
    heroText:
      'Discover Casa Thalassa and Casa al Vecchio Molo: two curated homes for relaxing stays between the sea, old town charm, and authentic atmosphere.',
    heroCta: 'Discover homes',
    loading: 'Loading homes...',
    loadError: 'We could not load the homes at the moment.',
    mapLabel: 'Location',
    openGallery: 'Open gallery',
    photos: 'photos',
    booking: '🛎️ View listing',
    openMaps: '🗺️ Open in Maps',
    directions: '🚗 Get directions',
    closeGallery: 'Close gallery',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    photo: 'Photo',
    of: 'of',
    keyboardHint: 'use ← → to navigate, Esc to close',
  },
} as const

const homeTextEn: Record<
  string,
  { location: string; description: string; highlights: string[] }
> = {
  'casa-thalassa-cefalu': {
    location: 'Cefalù, Sicily',
    description:
      'A home designed for guests who want to experience Cefalù through comfort, sea views, and walks in the historic center.',
    highlights: [
      'Strategic location for beach and old town',
      'Welcoming atmosphere for couples and families',
      'Perfect base to explore the Sicilian coastline',
    ],
  },
  'casa-al-vecchio-molo': {
    location: 'Cefalù, Sicily',
    description:
      'A character-filled home, ideal for a relaxing stay just a short walk from Cefalù’s main landmarks.',
    highlights: [
      'Charming and authentic setting',
      'Convenient for restaurants, harbor, and seafront',
      'Great for short or weekly stays',
    ],
  },
}

function App() {
  const [language, setLanguage] = useState<Language>('it')
  const [homes, setHomes] = useState<VacationHome[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxSlides, setLightboxSlides] = useState<
    Array<{ src: string; alt: string }>
  >([])
  const t = uiText[language]

  useEffect(() => {
    const loadHomes = async () => {
      try {
        const data = await getVacationHomes()
        setHomes(data)
      } catch {
        setError('load-error')
      } finally {
        setIsLoading(false)
      }
    }

    void loadHomes()
  }, [])

  const openGallery = (home: VacationHome, index = 0) => {
    if (!home.galleryImages || home.galleryImages.length === 0) {
      return
    }

    setLightboxSlides(
      home.galleryImages.map((image, imageIndex) => ({
        src: image,
        alt: `${home.name} - ${t.photo.toLowerCase()} ${imageIndex + 1}`,
      })),
    )
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const getMapQuery = (home: VacationHome) =>
    home.mapQuery || home.address || `${home.name} ${home.location}`

  const getMapsSearchUrl = (query: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

  const getMapsEmbedUrl = (query: string) =>
    `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`

  const getMapsDirectionsUrl = (query: string) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`

  const getLocalizedHome = (home: VacationHome) => {
    if (language === 'it') {
      return {
        location: home.location,
        description: home.description,
        highlights: home.highlights,
      }
    }

    const translation = homeTextEn[home.id]
    return {
      location: translation?.location ?? home.location,
      description: translation?.description ?? home.description,
      highlights: translation?.highlights ?? home.highlights,
    }
  }

  return (
    <div className="site-wrapper">
      <header className="hero">
        <div className="lang-switch" role="group" aria-label={t.languageSelector}>
          <button
            type="button"
            className={`lang-btn ${language === 'it' ? 'active' : ''}`}
            onClick={() => setLanguage('it')}
          >
            🇮🇹 IT
          </button>
          <button
            type="button"
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            🇬🇧 EN
          </button>
        </div>
        <p className="eyebrow">{t.heroEyebrow}</p>
        <h1>{t.heroTitle}</h1>
        <p className="hero-text">{t.heroText}</p>
        <a className="primary-btn" href="#abitazioni">
          {t.heroCta}
        </a>
      </header>

      <main className="content" id="abitazioni">
        {isLoading && <p className="info">{t.loading}</p>}
        {error && <p className="info error">{t.loadError}</p>}

        {!isLoading && !error && (
          <section className="home-grid">
            {homes.map((home) => {
              const mapQuery = getMapQuery(home)
              const localizedHome = getLocalizedHome(home)

              return (
                <article key={home.id} className="home-card">
                  <button
                    type="button"
                    className="cover-button"
                    onClick={() => openGallery(home)}
                  >
                    <img
                      className="home-image"
                      src={home.coverImage}
                      alt={`Vista della struttura ${home.name}`}
                    />
                  </button>
                  <div className="home-body">
                    <h2>{home.name}</h2>
                    <p className="location">{localizedHome.location}</p>
                    <p className="description-text">{localizedHome.description}</p>
                    <ul>
                      {localizedHome.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>

                    <div className="map-section">
                      <p className="map-label">{t.mapLabel}</p>
                      <p className="map-address">{home.address}</p>
                      <iframe
                        className="map-embed"
                        src={getMapsEmbedUrl(mapQuery)}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mappa di ${home.name}`}
                      />
                    </div>

                    <div className="actions">
                      {home.galleryImages && home.galleryImages.length > 0 && (
                        <button
                          type="button"
                          className="gallery-btn"
                          onClick={() => openGallery(home)}
                        >
                          {t.openGallery} ({home.galleryImages.length} {t.photos})
                        </button>
                      )}
                      <a
                        className="action-link action-booking"
                        href={home.bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.booking}
                      </a>
                      <a
                        className="action-link action-maps"
                        href={getMapsSearchUrl(mapQuery)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.openMaps}
                      </a>
                      <a
                        className="action-link action-directions"
                        href={getMapsDirectionsUrl(mapQuery)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.directions}
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </main>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        plugins={[Thumbnails]}
        controller={{ closeOnBackdropClick: true }}
        thumbnails={{ border: 0, borderRadius: 8, gap: 8 }}
      />
    </div>
  )
}

export default App
