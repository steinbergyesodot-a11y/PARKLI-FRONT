import { Routes, Route, useLocation } from "react-router-dom";
import App from "../App";
import { Home } from "./Home";
import { SignUp } from "../features/auth/components/SignUp";
import { About } from "./About";
import { DrivewayDetailed } from "../features/DrivewayDetailed/components/drivewayDetailed";
// import { Payment } from "./Payment";
import { Payment } from "../features/DrivewayDetailed/components/payment";
import { ProfilePageRenter } from "./ProfilePageRenter";
// import { ProfilePageOwner } from "./ProfilePageOwner";
import { ProfilePageOwner } from "../features/ownerProfile/components/ProfilePageOwner";
import { MainProfilePage } from "./MainProfilePage";
import { TermsOfService } from "./TermsOfService";
import { Help } from "./Help";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import TermsOfUse from "./TermsOfUse";
import PrivacyPolicy from "./PrivacyPolicy";
import CancellationPolicy from "./CancellationPolicy";
import OnboardingComplete from "../features/onboarding/components/OnboardingComplete";
import OnboardingRetry from "../features/onboarding/components/OnboardingRetry";
import { EditDriveway } from "../features/ownerProfile/components/EditDriveway.tsx";
import { NotFound } from "./NotFound";
import { ErrorBoundary } from "./ErrorBoundary";
import { Analytics } from '@vercel/analytics/react';
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";
import { Contact } from "./Contact";
import { Careers } from "./Careers";
import { OurMission } from "./OurMission";
import { Dashboard } from "../features/dashboard/components/dashboard";
import { Login } from "../features/auth/components/Login";
import { DrivewayDates } from "../features/DrivewayDetailed/components/drivewayDates";
import { AddDriveway } from "../features/addDriveway/components/AddDriveway";
import { OnboardingService } from "../features/onboarding/services/onboardingService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);



export function AnimatedRoutes() {
  return (
    <>
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AddDriveway" element={<AddDriveway />} />

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
      
      // DRIVEWAY DETAILED
      <Route path="/DrivewayDetailed/:id" element={<DrivewayDetailed />} />
      <Route path="/DrivewayDetailed/:drivewayId/dates" element={<DrivewayDates />} />
      <Route path="/DrivewayDetailed/:drivewayId/Payment"
          element={
          <Elements stripe={stripePromise}>
          <Payment />
          </Elements>
        }
      />

      <Route path="/Help" element={<Help />} />
      <Route path="/TermsOfUse" element={<TermsOfUse />} />
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/CancellationPolicy" element={<CancellationPolicy />} />
      {/* <Route path="/Onboard-Complete" element={<OnboardingComplete />} /> */}

      <Route path="/Onboarding-Complete" element={<OnboardingComplete />} />

      <Route path="/Onboard-Retry" element={<OnboardingRetry />} />
      <Route path="/EditDriveway/:drivewayId" element={<EditDriveway />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </ErrorBoundary>
    <Analytics />

    </>
    
  );
}
