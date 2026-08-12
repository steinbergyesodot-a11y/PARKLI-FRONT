import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../style/DrivewayMap.css';

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

const WRIGLEY_FIELD_CENTER: Coordinates = { lat: 41.9484384, lng: -87.6553327 };

function hashSeed(seed: string): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function fallbackCoordinates(seed: string): Coordinates {
  const baseLat = WRIGLEY_FIELD_CENTER.lat;
  const baseLng = WRIGLEY_FIELD_CENTER.lng;
  const hash = hashSeed(seed);
  const latOffset = ((hash % 100) / 100 - 0.5) * 0.014;
  const lngOffset = (((Math.floor(hash / 100) % 100) / 100) - 0.5) * 0.014;

  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset,
  };
}

const createPriceIcon = (price: number) => {
  const fill = '#2563eb';
  const stroke = '#1d4ed8';
  const text = '#ffffff';

  return divIcon({
    className: 'price-marker-icon',
    html: `<div class="price-marker-chip" style="background:${fill};border-color:${stroke};color:${text};">$${price}</div>`,
    iconSize: [56, 32],
    iconAnchor: [28, 16],
    popupAnchor: [0, -16],
  });
};

export function DrivewayMap({ driveways }: DrivewayMapProps) {
  const [locations, setLocations] = useState<DrivewayLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const safeDriveways = Array.isArray(driveways) ? driveways : [];

  useEffect(() => {
    let isCancelled = false;

    if (safeDriveways.length > 0) {
      const nextLocations = safeDriveways.map((driveway) => {
        const fallback = fallbackCoordinates(`${driveway._id}-${driveway.publicDisplay}`);

        return {
          id: driveway._id,
          name: driveway.name,
          address: driveway.publicDisplay,
          lat: fallback.lat,
          lng: fallback.lng,
          price: driveway.price,
        };
      });

      if (!isCancelled) {
        setLocations(nextLocations);
        setLoading(false);
      }
    } else {
      if (!isCancelled) {
        setLocations([]);
        setLoading(false);
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [safeDriveways]);

  const defaultCenter = useMemo(() => WRIGLEY_FIELD_CENTER, []);
  const visibleLocations = useMemo(() => locations, [locations]);
  const mapCenter = useMemo(() => {
    if (visibleLocations.length === 0) {
      return defaultCenter;
    }

    const totals = visibleLocations.reduce(
      (accumulator, location) => ({
        lat: accumulator.lat + location.lat,
        lng: accumulator.lng + location.lng,
      }),
      { lat: 0, lng: 0 }
    );

    return {
      lat: totals.lat / visibleLocations.length,
      lng: totals.lng / visibleLocations.length,
    };
  }, [defaultCenter, visibleLocations]);
  const mapStats = useMemo(() => {
    if (visibleLocations.length === 0) {
      return null;
    }

    const prices = visibleLocations.map((location) => location.price);
    const totalPrice = prices.reduce((sum, value) => sum + value, 0);

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: Math.round(totalPrice / prices.length),
      totalSpots: visibleLocations.length,
    };
  }, [visibleLocations]);
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

  if (visibleLocations.length === 0) {
    return (
      <div className="map-error">
        <div>📍 No pins to display</div>
        <div>There are no driveway locations to show on the map.</div>
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

      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={15}
        scrollWheelZoom
        className="leaflet-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visibleLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createPriceIcon(location.price)}
          >
            <Popup>
              <div className="map-info-window">
                <h4>{location.name}</h4>
                <p>{location.address}</p>
                <strong>${location.price}</strong>
                <Link className="map-popup-link" to={`/DrivewayDetailed/${location.id}`}>
                  View driveway
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
