import { onboardingApi } from "../api/onboardingApi";

export class OnboardingService {
  async checkStripeStatus() {
    const response = await onboardingApi.checkStripeStatus();
    return response.data;
  }

  async getUserDriveways(userId: string) {
    const response = await onboardingApi.getUserDriveways(userId);
    return response.data;
  }

  async checkStripeVerification(userId: string) {
    const response = await onboardingApi.checkStripeVerification(userId);
    return response.data;
  }
}

export const onboardingService = new OnboardingService();
