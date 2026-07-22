import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, LoadScriptNext, Marker } from '@react-google-maps/api';
import '../style/DrivewayMap.css';
import { geocodeAddress } from '../../../utils/geocode';

interface DrivewayLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
}

interface DrivewayMapProps {
  driveways: Array<{
    _id: string;
    name: string;
    address?: string;
    publicDisplay: string;
    price: number;
  }>;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const GEO_CACHE_KEY = 'dashboard_geocode_cache_v1';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  gestureHandling: 'greedy' as const,
  styles: [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#b8d8ff' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#eef6ec' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#f9eac8' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#ffd9a8' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#cbe9c8' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{ color: '#a8c9ff' }],
    },
    {
      featureType: 'administrative.neighborhood',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#5b6470' }],
    },
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBCuQJ5ztmnPHGjtp8yXJ3_tzufzchq3jg';

function readGeocodeCache(): Record<string, Coordinates> {
  try {
    const storedValue = localStorage.getItem(GEO_CACHE_KEY);
    if (!storedValue) {
      return {};
    }

    const parsedCache = JSON.parse(storedValue);
    return typeof parsedCache === 'object' && parsedCache !== null ? parsedCache : {};
  } catch {
    return {};
  }
}

function writeGeocodeCache(cache: Record<string, Coordinates>) {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage write failures; map can still render without caching.
  }
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function fallbackCoordinates(seed: string): Coordinates {
  const baseLat = 41.9484;
  const baseLng = -87.6555;
  const hash = hashSeed(seed);
  const latOffset = ((hash % 100) / 100 - 0.5) * 0.014;
  const lngOffset = (((Math.floor(hash / 100) % 100) / 100) - 0.5) * 0.014;

  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset,
  };
}

function getMarkerPalette(price: number, minPrice: number, maxPrice: number) {
  if (maxPrice <= minPrice) {
    return {
      fill: '%232563eb',
      stroke: '%231d4ed8',
      text: '%23ffffff',
    };
  }

  const normalizedPrice = (price - minPrice) / (maxPrice - minPrice);

  if (normalizedPrice < 0.34) {
    return {
      fill: '%2316a34a',
      stroke: '%2315803d',
      text: '%23ffffff',
    };
  }

  if (normalizedPrice < 0.67) {
    return {
      fill: '%23f59e0b',
      stroke: '%23d97706',
      text: '%231f2937',
    };
  }

  return {
    fill: '%23ef4444',
    stroke: '%23dc2626',
    text: '%23ffffff',
  };
}

const createSvgMarker = (price: number, minPrice: number, maxPrice: number) => {
  const palette = getMarkerPalette(price, minPrice, maxPrice);

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 70" width="52" height="70"><defs><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="%230f172a" flood-opacity="0.25"/></filter></defs><g filter="url(%23shadow)"><path d="M 26 2 C 12 2 2 12.2 2 25.5 C 2 42.2 26 68 26 68 C 26 68 50 42.2 50 25.5 C 50 12.2 40 2 26 2 Z" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="2"/><circle cx="26" cy="24" r="14" fill="%23ffffff" fill-opacity="0.18"/><text x="26" y="29" font-size="12" font-weight="700" text-anchor="middle" fill="${palette.text}">$${price}</text></g></svg>`;
};

export function DrivewayMap({ driveways }: DrivewayMapProps) {
  const [locations, setLocations] = useState<DrivewayLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState<DrivewayLocation | null>(null);

  const safeDriveways = Array.isArray(driveways) ? driveways : [];

  useEffect(() => {
    let isCancelled = false;

    async function geocodeDriveways() {
      setLoading(true);
      const cachedCoordinates = readGeocodeCache();
      let isCacheDirty = false;

      const geocodedLocations = await Promise.all(
        safeDriveways.map(async (driveway) => {
          const normalizedAddress = driveway.address?.trim() || driveway.publicDisplay?.trim();
          const addressKey = normalizedAddress ? `${normalizedAddress}, Chicago, IL` : '';
          let coordinates = addressKey ? cachedCoordinates[addressKey] : undefined;

          if (!coordinates && addressKey) {
            try {
              coordinates = await geocodeAddress(addressKey);
              cachedCoordinates[addressKey] = coordinates;
              isCacheDirty = true;
            } catch {
              coordinates = undefined;
            }
          }

          const fallback = fallbackCoordinates(`${driveway._id}-${driveway.publicDisplay}`);
          const finalCoordinates = coordinates ?? fallback;

          return {
            id: driveway._id,
            name: driveway.name,
            address: driveway.publicDisplay,
            lat: finalCoordinates.lat,
            lng: finalCoordinates.lng,
            price: driveway.price,
          };
        })
      );

      if (isCacheDirty) {
        writeGeocodeCache(cachedCoordinates);
      }

      if (!isCancelled) {
        setLocations(geocodedLocations);
        setLoading(false);
      }
    }

    if (safeDriveways.length > 0) {
      geocodeDriveways();
    } else {
      setLocations([]);
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [safeDriveways]);

  const defaultCenter = useMemo(() => ({ lat: 41.9484, lng: -87.6555 }), []);
  const mapCenter = useMemo(() => {
    if (locations.length === 0) {
      return defaultCenter;
    }

    const totals = locations.reduce(
      (accumulator, location) => ({
        lat: accumulator.lat + location.lat,
        lng: accumulator.lng + location.lng,
      }),
      { lat: 0, lng: 0 }
    );

    return {
      lat: totals.lat / locations.length,
      lng: totals.lng / locations.length,
    };
  }, [defaultCenter, locations]);
  const mapStats = useMemo(() => {
    if (locations.length === 0) {
      return null;
    }

    const prices = locations.map((location) => location.price);
    const totalPrice = prices.reduce((sum, value) => sum + value, 0);

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: Math.round(totalPrice / prices.length),
      totalSpots: locations.length,
    };
  }, [locations]);

  if (loading) {
    return (
      <div className="map-loading">
        <div className="map-spinner"></div>
        <div>Loading map...</div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="map-error">
        <div>📍 No driveways to display</div>
        <div>Check back later for available locations</div>
      </div>
    );
  }

  return (
    <div className="driveway-map-container">
      <div className="map-topbar">
        <div className="map-disclaimer">
          <span className="disclaimer-icon">i</span>
          <span className="disclaimer-text">Pins are approximate. Full address appears after booking.</span>
        </div>

        {mapStats && (
          <div className="map-stats-row">
            <span className="map-stat-chip">{mapStats.totalSpots} spots</span>
            <span className="map-stat-chip">Avg ${mapStats.avgPrice}</span>
            <span className="map-stat-chip">${mapStats.minPrice} - ${mapStats.maxPrice}</span>
          </div>
        )}
      </div>

      <LoadScriptNext googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={13}
          options={mapOptions}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setActiveLocation(location)}
              icon={{
                url: createSvgMarker(
                  location.price,
                  mapStats?.minPrice ?? location.price,
                  mapStats?.maxPrice ?? location.price
                ),
                scaledSize: new google.maps.Size(52, 70),
                anchor: new google.maps.Point(26, 70),
              }}
            />
          ))}

          {activeLocation && (
            <InfoWindow
              position={{ lat: activeLocation.lat, lng: activeLocation.lng }}
              onCloseClick={() => setActiveLocation(null)}
            >
              <div className="map-info-window">
                <h4>{activeLocation.name}</h4>
                <p>{activeLocation.address}</p>
                <strong>${activeLocation.price}</strong>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
}
