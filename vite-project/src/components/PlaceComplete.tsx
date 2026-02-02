import { useEffect, useRef } from "react";
import "../style/PlaceComplete.css";

type Props = {
  onSelect: (address: string) => void;
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
    const address = place.formatted_address || "";
    onSelect(address);
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
