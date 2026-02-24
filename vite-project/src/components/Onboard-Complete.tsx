import { useEffect, useState } from "react";
import axios from "axios";
import HostSuccess from "./HostSuccess";
import { jwtDecode } from "jwt-decode";

type Status = "checking" | "success" | "incomplete" | "error";

export default function OnboardingComplete() {
  const [status, setStatus] = useState<Status>("checking");
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [drivewayAddress, setDrivewayAddress] = useState<string>("");

  useEffect(() => {
    async function checkStatus() {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("No auth token found");
          setStatus("error");
          return;
        }

        // ⭐ Decode token to get userId
        let userId: string | null = null;
        try {
          const decoded: any = jwtDecode(token);
          userId = decoded._id; // matches your backend payload
        } catch (err) {
          console.error("Failed to decode token:", err);
          setStatus("error");
          return;
        }

        if (!userId) {
          console.error("Decoded token has no _id");
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

          // ⭐ Fetch all driveways for this user
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

        } else {
          setStatus("incomplete");
          setContinueUrl(res.data.onboardingUrl || null);
        }
      } catch (err) {
        console.error("Error checking onboarding:", err);
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

  return <p>Something went wrong. Please try again.</p>;
}
