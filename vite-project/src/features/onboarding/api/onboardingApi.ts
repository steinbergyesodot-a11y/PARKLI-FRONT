import api from "../../../lib/axiosClient";

export const onboardingApi = {
  checkStripeStatus: () => api.get("/api/users/stripe/check-status"),
  getUserDriveways: (userId: string) => api.get(`/api/driveways/getAllDrivewaysByUserId/${userId}`),
  checkStripeVerification: (userId: string) => api.get(`/api/users/${userId}/stripe/check-verification`),
};
