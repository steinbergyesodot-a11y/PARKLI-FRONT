import { Routes, Route, useLocation } from "react-router";
import { useEffect, useState } from "react";
import App from "../App";
import { Home } from "./Home";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { About } from "./About";
import AddDriveway from "./AddDriveway";
import { DrivewayDetailed } from "./DrivewayDetailed";
import { Payment } from "./Paymant";

export function AnimatedRoutes() {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // bump the key whenever the route changes
    setKey(prev => prev + 1);
  }, [location]);

  return (
    <div className="app-container" key={key}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AddDriveway" element={<AddDriveway />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/About" element={<About />} />
        <Route path="DrivewayDetailed/:id" element={<DrivewayDetailed />} />
        <Route path="DrivewayDetailed/:id/Payment" element={<Payment />} />

      </Routes>
    </div>
  );
}
