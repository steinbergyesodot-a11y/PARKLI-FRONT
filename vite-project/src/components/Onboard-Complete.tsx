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
          console.error(msg);
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
          userId = decoded._id; // matches your backend payload
        } catch (err) {
          console.error("Failed to decode token:", err);
          setErrorMessage(String(err));
          setStatus("error");
          return;
        }

        if (!userId) {
          const msg = "Decoded token has no _id field.";
          console.error(msg);
          setErrorMessage(msg);
          setStatus("error");
          return;
        }

        // ⭐ Check Stripe onboarding status
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/stripe/check-status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.verified) {
          setStatus("success");

          // Check if there's a newly created driveway in localStorage
          const newDrivewayAddress = localStorage.getItem("newDrivewayAddress");
          
          if (newDrivewayAddress) {
            setDrivewayAddress(newDrivewayAddress);
            // Clear it after using
            localStorage.removeItem("newDrivewayAddress");
            localStorage.removeItem("newDrivewayId");
          } else {
            // Fallback: Fetch all driveways and show the most recent one
            const drivewayRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/driveways/getAllDrivewaysByUserId/${userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const driveways = drivewayRes.data.driveways;

            if (driveways && driveways.length > 0) {
              setDrivewayAddress(driveways[0].address);
            } else {
              console.warn("User has no driveways");
            }
          }

        } else {
          setStatus("incomplete");
          setContinueUrl(res.data.onboardingUrl || null);
        }
      } catch (err: any) {
        console.error("Error checking onboarding:", err);
        const body = err?.response?.data ? JSON.stringify(err.response.data) : err.message || String(err);
        setErrorMessage(body);
        setStatus("error");
      }
    }

    checkStatus();
  }, []);

  if (status === "checking") return <p>Checking your Stripe status…</p>;

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
