import { useEffect, useRef } from "react";

export function useTurnstile() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && window.turnstile) {
      window.turnstile.render(ref.current, {
        sitekey: "0x4AAAAAADIhzA8BVcOnTq3K",
      });
    }
  }, []);

  const getToken = () =>
    (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value || "";

  return { ref, getToken };
}
