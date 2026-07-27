export {};

declare global {
  namespace google.maps.places {
    class PlaceAutocompleteElement extends HTMLElement {
      constructor(options?: {
        types?: string[];
        componentRestrictions?: { country: string | string[] };
      });

      addEventListener(
        type: "gmp-placeselect",
        listener: (event: {
          place: {
            formattedAddress?: string;
            fetchFields: (opts: { fields: string[] }) => Promise<void>;
          };
        }) => void
      ): void;
    }
  }
}
