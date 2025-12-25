import apiClient from "./axiosConfig";

class BookingService {
  /**
   * Get booking history for the current user
   * @returns {Promise} Promise with booking history data
   */
  async getBookingHistory() {
    try {
      const response = await apiClient.get("/api/bookings/history");
      return response.data;
    } catch (error) {
      console.error("Error fetching booking history:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get upcoming bookings for the current user
   * @returns {Promise} Promise with upcoming bookings data
   */
  async getUpcomingBookings() {
    try {
      const response = await apiClient.get("/api/bookings/upcoming");
      // Normalize the data before returning to ensure frontend components work correctly
      const bookingsData = response.data.data || response.data || [];
      return { data: bookingsData.map((booking) => this.normalizeBooking(booking)) };
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get booking details by ID
   * @param {number} bookingId - The booking ID
   * @returns {Promise} Promise with booking details
   */
  async getBookingDetails(bookingId) {
    try {
      const response = await apiClient.get(`/api/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Cancel a booking
   * @param {number} bookingId - The booking ID to cancel
   * @returns {Promise} Promise with cancellation result
   */
  async cancelBooking(bookingId) {
    try {
      const response = await apiClient.post(
        `/api/bookings/${bookingId}/cancel`
      );
      return response.data;
    } catch (error) {
      console.error("Error canceling booking:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - The error object
   * @returns {string} Error message
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "An error occurred";
      return message;
    } else if (error.request) {
      // Request made but no response received
      return "No response from server. Please check your connection.";
    } else {
      // Error in request setup
      return error.message || "An unexpected error occurred";
    }
  }

  /**
   * Normalize booking data for backward compatibility with UI components
   * Converts backend response format to frontend-friendly format
   */
  normalizeBooking(booking) {
    if (booking.type === "HOTEL") {
      return {
        id: booking.hotelBooking.bookingId,
        type: "HOTEL",
        status: booking.hotelBooking.status,
        checkInDate: booking.hotelBooking.checkInDate,
        checkOutDate: booking.hotelBooking.checkOutDate,
        totalPrice: booking.hotelBooking.totalPrice,
        createdAt: booking.hotelBooking.createdAt,
        numberOfGuests: booking.hotelBooking.numberOfGuests,
        room: {
          type: booking.hotelBooking.room.type,
          capacity: booking.hotelBooking.room.capacity,
          price: booking.hotelBooking.room.price,
          hotel: {
            id: booking.hotelBooking.hotel.id,
            name: booking.hotelBooking.hotel.name,
            city: booking.hotelBooking.hotel.city,
            country: booking.hotelBooking.hotel.country,
            location: `${booking.hotelBooking.hotel.city}, ${booking.hotelBooking.hotel.country}`,
          },
        },
        // Raw backend data for reference
        __raw: booking,
      };
    } else {
      return {
        id: booking.flightBooking.ticketId,
        type: "FLIGHT",
        status: booking.flightBooking.isPaid ? "CONFIRMED" : "PENDING",
        checkInDate: booking.flightBooking.flightDate,
        checkOutDate: booking.flightBooking.flightDate,
        totalPrice: booking.flightBooking.totalPrice,
        createdAt: booking.flightBooking.createdAt,
        ticket: {
          class: booking.flightBooking.trip.type,
          type: booking.flightBooking.trip.type,
          price: booking.flightBooking.trip.price,
          flight: {
            airline: {
              name: booking.flightBooking.airline.name,
              nationality: booking.flightBooking.airline.nationality,
            },
            from: booking.flightBooking.flight.departureCity,
            to: booking.flightBooking.flight.arrivalCity,
            departureCity: booking.flightBooking.flight.departureCity,
            arrivalCity: booking.flightBooking.flight.arrivalCity,
            departureTime: booking.flightBooking.flight.departureDate,
            arrivalTime: booking.flightBooking.flight.arrivalDate,
            departureDate: booking.flightBooking.flight.departureDate,
            arrivalDate: booking.flightBooking.flight.arrivalDate,
            departureAirport: booking.flightBooking.flight.departureAirport,
            arrivalAirport: booking.flightBooking.flight.arrivalAirport,
          },
        },
        // Raw backend data for reference
        __raw: booking,
      };
    }
  }
}

const bookingService = new BookingService();
export default bookingService;
