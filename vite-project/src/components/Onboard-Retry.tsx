import axios from "axios";

export default function OnboardingRetry() {
  async function handleRetry() {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/stripe/start-onboarding`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.location.href = res.data.onboardingUrl;
  }

  return (
    <div>
      <h2>Your Stripe onboarding session expired.</h2>
      <button onClick={handleRetry}>Resume onboarding</button>
    </div>
  );
}
