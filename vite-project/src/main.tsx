import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { UserProvider } from "./userContext.tsx";
import { AnimatedRoutes } from "./components/AnimatedRoutes.tsx";

// Load Google Maps script from environment variable
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
script.async = true;
script.defer = true;
document.head.appendChild(script);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
