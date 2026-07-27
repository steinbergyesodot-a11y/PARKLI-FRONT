import { useEffect, useState } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { onboardingService } from "../services/onboardingService";

type Status = "checking" | "success" | "incomplete" | "error";

type StripeStatusResponse = {
  verified: boolean;
  isStripeVerified?: boolean;
  onboardingUrl?: string;
};

type Driveway = {
  _id: string;
  address: string;
};

type OnboardingStatusResult = {
  status: Status;
  continueUrl: string | null;
  drivewayAddress: string;
  errorMessage: string | null;
};

interface MyPayload extends JwtPayload {
  _id?: string;
}

export function useOnboardingStatus(): OnboardingStatusResult {
  const [status, setStatus] = useState<Status>("checking");
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [drivewayAddress, setDrivewayAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setErrorMessage("No auth token found in localStorage.");
          setStatus("error");
          return;
        }

        const decoded = jwtDecode<MyPayload>(token);
        const userId = decoded._id;

        if (!userId) {
          setErrorMessage("Decoded token has no _id field.");
          setStatus("error");
          return;
        }

        const statusResponse = await onboardingService.checkStripeStatus();
        const { verified, onboardingUrl } = statusResponse.data as StripeStatusResponse;

        if (verified) {
          setStatus("success");

          const newDrivewayAddress = localStorage.getItem("newDrivewayAddress");
          if (newDrivewayAddress) {
            setDrivewayAddress(newDrivewayAddress);
            localStorage.removeItem("newDrivewayAddress");
            localStorage.removeItem("newDrivewayId");
            return;
          }

          const drivewayRes = await onboardingService.getUserDriveways(userId);
          const driveways = (drivewayRes.data as { driveways: Driveway[] }).driveways;

          if (driveways && driveways.length > 0) {
            setDrivewayAddress(driveways[0].address);
          }
          return;
        }

        setStatus("incomplete");
        setContinueUrl(onboardingUrl || null);
      } catch (err: any) {
        const body = err?.response?.data ? JSON.stringify(err.response.data) : err.message || String(err);
        setErrorMessage(body);
        setStatus("error");
      }
    }

    checkStatus();
  }, []);

  return {
    status,
    continueUrl,
    drivewayAddress,
    errorMessage,
  };
}
