import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

export function DrivewayMap({ driveways }: DrivewayMapProps) {
  const [locations, setLocations] = useState<DrivewayLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function geocodeAddresses() {
      setLoading(true);
      const geocodedLocations: DrivewayLocation[] = [];

      // For now, use hardcoded coordinates for Chicago area
      // This can be enhanced later with proper geocoding
      const chicagoCoordinates = [
        { lat: 41.9484, lng: -87.6555 }, // Wrigley Field
        { lat: 41.9500, lng: -87.6600 }, // Near Wrigley
        { lat: 41.9450, lng: -87.6500 }, // Another nearby location
        { lat: 41.9520, lng: -87.6580 }, // Another spot
        { lat: 41.9460, lng: -87.6520 }, // Final spot
      ];

      driveways.forEach((driveway, index) => {
        // Assign coordinates from our predefined list, cycling if needed
        const coord = chicagoCoordinates[index % chicagoCoordinates.length];
        geocodedLocations.push({
          id: driveway._id,
          name: driveway.name,
          address: driveway.publicDisplay,
          lat: coord.lat + (Math.random() - 0.5) * 0.01, // Add small random variation
          lng: coord.lng + (Math.random() - 0.5) * 0.01,
          price: driveway.price
        });
      });

      setLocations(geocodedLocations);
      setLoading(false);
    }

    if (driveways.length > 0) {
      geocodeAddresses();
    } else {
      setLoading(false);
    }
  }, [driveways]);

  // Default center to Chicago (Wrigley Field area)
  const defaultCenter = [41.9484, -87.6555] as [number, number];

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
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ width: '100%', height: 'calc(100% - 40px)' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng] as [number, number]}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>{location.name}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{location.address}</p>
                <p style={{ margin: '0', fontWeight: 'bold', color: '#4285F4' }}>
                  ${location.price}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
