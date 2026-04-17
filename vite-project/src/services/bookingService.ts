import api from "./baseUrl";

export class BookingService {
  async fetchBookings(userId: string) {
    const response = await api.get(`/api/bookings/${userId}`);
    const apiResponse = response.data;
    return apiResponse.data || [];
  }
}

export const bookingService = new BookingService();
