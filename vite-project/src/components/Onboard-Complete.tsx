import { useEffect, useState } from "react";
import axios from "axios";
import HostSuccess from "./HostSuccess";

type Status = "checking" | "success" | "incomplete" | "error";

export default function OnboardingComplete() {
  const [status, setStatus] = useState<Status>("checking");
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [drivewayAddress, setDrivewayAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
  async function checkStatus() {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        const msg = "No auth token found in localStorage.";
        setErrorMessage(msg);
        setStatus("error");
        return;
      }

      // ⭐ Decode token to get userId (lightweight, no external lib)
      let userId: string | null = null;
      try {
        const parseJwt = (t: string) => {
          const parts = t.split('.');
          if (parts.length < 2) throw new Error('Invalid JWT');
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(jsonPayload);
        };

        const decoded: any = parseJwt(token);
        userId = decoded._id;
      } catch (err) {
        setErrorMessage(String(err));
        setStatus("error");
        return;
      }

      if (!userId) {
        const msg = "Decoded token has no _id field.";
        setErrorMessage(msg);
        setStatus("error");
        return;
      }

      // ⭐ Check Stripe onboarding status
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/stripe/check-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ FIXED: Access res.data.data (standardized format)
      const { verified, isStripeVerified } = res.data.data;

      if (verified) {
        setStatus("success");

        // Check if there's a newly created driveway in localStorage
        const newDrivewayAddress = localStorage.getItem("newDrivewayAddress");
        
        if (newDrivewayAddress) {
          setDrivewayAddress(newDrivewayAddress);
          localStorage.removeItem("newDrivewayAddress");
          localStorage.removeItem("newDrivewayId");
        } else {
          // Fallback: Fetch all driveways and show the most recent one
          const drivewayRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/driveways/getAllDrivewaysByUserId/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // ✅ FIXED: Access res.data.data for standardized response
          const driveways = drivewayRes.data.data.driveways;

          if (driveways && driveways.length > 0) {
            setDrivewayAddress(driveways[0].address);
          } else {
            // No driveways found
          }
        }

      } else {
        setStatus("incomplete");
        // Note: Your backend doesn't return onboardingUrl in checkStripeStatus
        // You may need to fetch it separately or redirect to Stripe onboarding URL
        setContinueUrl(null);
      }
    } catch (err: any) {
      const body = err?.response?.data ? JSON.stringify(err.response.data) : err.message || String(err);
      setErrorMessage(body);
      setStatus("error");
    }
  }

  checkStatus();
}, []);

  if (status === "checking") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: "20px"
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}
        />
        <p style={{ fontSize: "18px", color: "#666" }}>Checking your Stripe status…</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (status === "success") {
    return <HostSuccess address={drivewayAddress} />;
  }

  if (status === "incomplete") {
    return (
      <div>
        <h2>You still have steps to finish.</h2>
        <button onClick={() => continueUrl && (window.location.href = continueUrl)}>
          Continue onboarding
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Something went wrong. Please try again.</h2>
      {errorMessage && (
        <pre style={{ whiteSpace: 'pre-wrap', color: '#900' }}>{errorMessage}</pre>
      )}
    </div>
  );
}
