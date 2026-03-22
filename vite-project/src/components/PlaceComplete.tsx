import { useEffect, useRef } from "react";
import "../style/PlaceComplete.css";

type AddressData = {
  full_address: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  publicDisplay: string;
};

type Props = {
  onSelect: (addressData: AddressData) => void;
};

export function PlaceAutocompleteTS({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

 useEffect(() => {
  if (!window.google?.maps?.places || !inputRef.current) return;

  const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
    types: ["address"],
    strictBounds: true,
  });

  const bounds = new google.maps.LatLngBounds(
    { lat: 41.9350, lng: -87.6750 }, // SW
    { lat: 41.9600, lng: -87.6350 }  // NE
  );

  autocomplete.setBounds(bounds); // <-- IMPORTANT

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    
    // Extract address components
    const addressComponents = place.address_components || [];
    
    const getComponent = (type: string): string => {
      const component = addressComponents.find(c => c.types.includes(type));
      return component?.long_name || "";
    };
    
    const getShortComponent = (type: string): string => {
      const component = addressComponents.find(c => c.types.includes(type));
      return component?.short_name || "";
    };
    
    const full_address = place.formatted_address || "";
    const city = getComponent("locality");
    const state = getShortComponent("administrative_area_level_1");
    const zipcode = getComponent("postal_code");
    const latitude = place.geometry?.location?.lat() || 0;
    const longitude = place.geometry?.location?.lng() || 0;
    const publicDisplay = city && state && zipcode 
      ? `${city}, ${state} ${zipcode}` 
      : full_address;

    const addressData: AddressData = {
      full_address,
      address: full_address,
      city,
      state,
      zipcode,
      latitude,
      longitude,
      publicDisplay
    };

    onSelect(addressData);
  });
}, [onSelect]);


  return (
    <div className="addressWrapper">
      <input
        ref={inputRef}
        className="addressInput"
        placeholder="Enter address"
      />
    </div>
  );
}
