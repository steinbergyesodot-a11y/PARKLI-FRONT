import { useOnboardingRetry } from "../hooks/useOnboardingRetry";

export default function OnboardingRetry() {
  const { handleRetry, error } = useOnboardingRetry();

  return (
    <div>
      <h2>Your Stripe onboarding session expired.</h2>
      <button onClick={handleRetry}>Resume onboarding</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
