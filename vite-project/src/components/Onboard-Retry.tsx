import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../userContext"; // adjust path as needed

export default function OnboardingRetry() {
  const userContext = useContext(UserContext);
  
  async function handleRetry() {
    const token = localStorage.getItem("authToken");
    const userId = userContext?.user?._id; // or however you store the userId
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/stripe/check-verification`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.data.onboardingUrl) {
        window.location.href = res.data.data.onboardingUrl;
      }
    } catch (error) {
      console.error("Failed to retrieve onboarding URL", error);
    }
  }

  return (
    <div>
      <h2>Your Stripe onboarding session expired.</h2>
      <button onClick={handleRetry}>Resume onboarding</button>
    </div>
  );
}