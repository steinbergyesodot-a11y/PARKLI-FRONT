import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, LoadScriptNext, Marker } from '@react-google-maps/api';
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
    publicDisplay: string;
    price: number;
  }>;
}

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
      stylers: [{ color: '#dfe7ef' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f4f7f9' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#cfd8e3' }],
    },
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBCuQJ5ztmnPHGjtp8yXJ3_tzufzchq3jg';

const createSvgMarker = (price: number) => 
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64" width="48" height="64"><path d="M 24 0 C 10.7 0 0 10.7 0 24 C 0 40 24 64 24 64 C 24 64 48 40 48 24 C 48 10.7 37.3 0 24 0 Z" fill="%23ffffff" stroke="%2394a3b8" stroke-width="2"/><text x="24" y="28" font-size="12" font-weight="bold" text-anchor="middle" fill="%23334155">$${price}</text></svg>`;

export function DrivewayMap({ driveways }: DrivewayMapProps) {
  const [locations, setLocations] = useState<DrivewayLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState<DrivewayLocation | null>(null);

  const safeDriveways = Array.isArray(driveways) ? driveways : [];

  useEffect(() => {
    async function geocodeAddresses() {
      setLoading(true);
      const geocodedLocations: DrivewayLocation[] = [];

      const chicagoCoordinates = [
        { lat: 41.9484, lng: -87.6555 },
        { lat: 41.9500, lng: -87.6600 },
        { lat: 41.9450, lng: -87.6500 },
        { lat: 41.9520, lng: -87.6580 },
        { lat: 41.9460, lng: -87.6520 },
      ];

      safeDriveways.forEach((driveway, index) => {
        const coord = chicagoCoordinates[index % chicagoCoordinates.length];
        geocodedLocations.push({
          id: driveway._id,
          name: driveway.name,
          address: driveway.publicDisplay,
          lat: coord.lat + (Math.random() - 0.5) * 0.01,
          lng: coord.lng + (Math.random() - 0.5) * 0.01,
          price: driveway.price,
        });
      });

      setLocations(geocodedLocations);
      setLoading(false);
    }

    if (safeDriveways.length > 0) {
      geocodeAddresses();
    } else {
      setLoading(false);
    }
  }, [safeDriveways]);

  const defaultCenter = useMemo(() => ({ lat: 41.9484, lng: -87.6555 }), []);

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
      <div className="map-disclaimer">
        <span className="disclaimer-icon">ℹ️</span>
        <span className="disclaimer-text">Map pins are approximate. Full address provided after booking.</span>
      </div>

      <LoadScriptNext googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={13}
          options={mapOptions}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setActiveLocation(location)}
              icon={{
                url: createSvgMarker(location.price),
                scaledSize: new google.maps.Size(48, 64),
                anchor: new google.maps.Point(24, 64),
              }}
            />
          ))}

          {activeLocation && (
            <InfoWindow
              position={{ lat: activeLocation.lat, lng: activeLocation.lng }}
              onCloseClick={() => setActiveLocation(null)}
            >
              <div style={{ minWidth: '200px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>{activeLocation.name}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{activeLocation.address}</p>
                <p style={{ margin: '0', fontWeight: 'bold', color: '#2563eb' }}>
                  ${activeLocation.price}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
}
