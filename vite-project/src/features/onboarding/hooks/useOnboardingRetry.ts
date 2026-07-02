import { useContext, useState } from "react";
import { UserContext } from "../../../userContext";
import { onboardingService } from "../services/onboardingService";

export function useOnboardingRetry() {
  const [error, setError] = useState<string | null>(null);
  const userContext = useContext(UserContext);
  const userId = userContext?.user?._id;

  async function handleRetry() {
    if (!userId) {
      setError("Unable to find the current user.");
      return;
    }

    try {
      const response = await onboardingService.checkStripeVerification(userId);
      const onboardingUrl =
        response.data?.onboardingUrl || response.data?.onboardingLink;

      if (onboardingUrl) {
        window.location.assign(onboardingUrl);
      } else {
        setError("No onboarding URL returned from the server.");
      }
    } catch (err: any) {
      const body = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err.message || String(err);
      setError(body);
    }
  }

  return {
    handleRetry,
    error,
  };
}
