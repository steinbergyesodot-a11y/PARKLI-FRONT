import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { UserProvider } from "./userContext.tsx";
import { AnimatedRoutes } from "./components/AnimatedRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
