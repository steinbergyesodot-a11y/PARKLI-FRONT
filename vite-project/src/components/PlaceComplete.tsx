import { useEffect, useRef } from "react";

type Props = {
  onSelect: (address: string) => void;
};

export function PlaceAutocompleteTS({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google?.maps?.places || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "il" }
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || "";
      onSelect(address);
    });
  }, [onSelect]);

  return <input ref={inputRef} placeholder="Enter address" />;
}
