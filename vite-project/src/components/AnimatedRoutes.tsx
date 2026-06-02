import { Routes, Route, useLocation } from "react-router-dom";
import App from "../App";
import { Home } from "./Home";
import { SignUp } from "../features/auth/components/SignUp";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { About } from "./About";
import { DrivewayDetailed } from "./DrivewayDetailed";
import { Payment } from "./Payment";
import { ProfilePageRenter } from "./ProfilePageRenter";
import { ProfilePageOwner } from "./ProfilePageOwner";
import { MainProfilePage } from "./MainProfilePage";
import { TermsOfService } from "./TermsOfService";
import { AddDriveway2 } from "./AddDriveway2";
import { Help } from "./Help";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import TermsOfUse from "./TermsOfUse";
import PrivacyPolicy from "./PrivacyPolicy";
import CancellationPolicy from "./CancellationPolicy";
import OnboardingComplete from "./Onboard-Complete";
import OnboardingRetry from "./Onboard-Retry";
import { EditDriveway } from "./EditDriveway";
import { NotFound } from "./NotFound";
import { ErrorBoundary } from "./ErrorBoundary";
import { Analytics } from '@vercel/analytics/react';
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";
import { Contact } from "./Contact";
import { Careers } from "./Careers";
import { OurMission } from "./OurMission";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);



export function AnimatedRoutes() {
  return (
    <>
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AddDriveway" element={<AddDriveway2 />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/Reset-password/:token" element={<ResetPassword />} />

      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/About" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/our-mission" element={<OurMission />} />
      <Route path="/profile" element={<MainProfilePage />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/Profile/renter" element={<ProfilePageRenter />} />
      <Route path="/Profile/DrivewayOwner" element={<ProfilePageOwner />} />
      <Route path="/DrivewayDetailed/:id" element={<DrivewayDetailed />} />
      <Route path="/Help" element={<Help />} />
      <Route path="/TermsOfUse" element={<TermsOfUse />} />
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/CancellationPolicy" element={<CancellationPolicy />} />
      <Route path="/Onboard-Complete" element={<OnboardingComplete />} />
      <Route path="/Onboard-Retry" element={<OnboardingRetry />} />
      <Route path="/EditDriveway/:drivewayId" element={<EditDriveway />} />
      <Route path="/DrivewayDetailed/:id/Payment"
          element={
          <Elements stripe={stripePromise}>
          <Payment />
          </Elements>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </ErrorBoundary>
    <Analytics />

    </>
    
  );
}
