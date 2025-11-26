import { useEffect, useRef, useState } from "react";


declare global {
  interface Window {
    google: any;
  }
}


function AddressInput() {
  const inputRef = useRef(null);        // reference to the input element
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!window.google) return;         // make sure Google script is loaded

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["address"] }            // restrict to addresses only
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address); // update React state
    });
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter address"
        style={{ width: "300px", padding: "8px" }}
      />
      <p>Selected: {address}</p>
    </div>
  );
}

export default AddressInput;
