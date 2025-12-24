import apiClient from "./axiosConfig";

// Mock data for testing
const MOCK_ENABLED = true; // Set to false when backend is ready

const mockBookings = [
  {
    id: 1,
    type: "HOTEL",
    status: "CONFIRMED",
    checkInDate: "2025-12-28T14:00:00",
    checkOutDate: "2026-01-02T11:00:00",
    adults: 2,
    children: 1,
    totalPrice: 750.0,
    createdAt: "2025-12-10T10:30:00",
    room: {
      roomNumber: "305",
      type: "Deluxe Suite",
      capacity: 4,
      price: 150.0,
      hotel: {
        name: "Grand Plaza Hotel",
        location: "New York, NY",
        phoneNumber: "+1 (212) 555-0123",
        email: "info@grandplaza.com",
      },
    },
  },
  {
    id: 2,
    type: "FLIGHT",
    status: "CONFIRMED",
    checkInDate: "2025-12-26T08:30:00",
    checkOutDate: "2025-12-26T11:45:00",
    adults: 1,
    children: 0,
    totalPrice: 350.0,
    createdAt: "2025-12-15T14:20:00",
    ticket: {
      ticketNumber: "AA1234567",
      class: "Economy",
      seatNumber: "12A",
      flight: {
        flightNumber: "AA123",
        from: "New York (JFK)",
        to: "Los Angeles (LAX)",
        airline: {
          name: "American Airlines",
          code: "AA",
        },
        departureTime: "2025-12-26T08:30:00",
        arrivalTime: "2025-12-26T11:45:00",
      },
    },
  },
  {
    id: 3,
    type: "HOTEL",
    status: "CONFIRMED",
    checkInDate: "2026-01-15T14:00:00",
    checkOutDate: "2026-01-18T11:00:00",
    adults: 1,
    children: 0,
    totalPrice: 270.0,
    createdAt: "2025-12-20T09:15:00",
    room: {
      roomNumber: "208",
      type: "Standard Room",
      capacity: 2,
      price: 90.0,
      hotel: {
        name: "City Center Inn",
        location: "Chicago, IL",
        phoneNumber: "+1 (312) 555-0789",
        email: "contact@citycenterinn.com",
      },
    },
  },
  {
    id: 4,
    type: "FLIGHT",
    status: "COMPLETED",
    checkInDate: "2024-10-10T09:00:00",
    checkOutDate: "2024-10-10T14:30:00",
    adults: 2,
    children: 1,
    totalPrice: 890.0,
    createdAt: "2024-09-25T11:45:00",
    ticket: {
      ticketNumber: "DL9876543",
      class: "Business",
      seatNumber: "3B",
      flight: {
        flightNumber: "DL456",
        from: "San Francisco (SFO)",
        to: "Miami (MIA)",
        airline: {
          name: "Delta Airlines",
          code: "DL",
        },
        departureTime: "2024-10-10T09:00:00",
        arrivalTime: "2024-10-10T14:30:00",
      },
    },
  },
  {
    id: 5,
    type: "FLIGHT",
    status: "CONFIRMED",
    checkInDate: "2026-01-05T15:20:00",
    checkOutDate: "2026-01-05T19:40:00",
    adults: 2,
    children: 0,
    totalPrice: 520.0,
    createdAt: "2025-12-22T10:30:00",
    ticket: {
      ticketNumber: "UA5551234",
      class: "Economy Plus",
      seatNumber: "15C",
      flight: {
        flightNumber: "UA789",
        from: "Chicago (ORD)",
        to: "Seattle (SEA)",
        airline: {
          name: "United Airlines",
          code: "UA",
        },
        departureTime: "2026-01-05T15:20:00",
        arrivalTime: "2026-01-05T19:40:00",
      },
    },
  },
  {
    id: 6,
    type: "HOTEL",
    status: "CONFIRMED",
    checkInDate: "2026-02-14T14:00:00",
    checkOutDate: "2026-02-17T11:00:00",
    adults: 2,
    children: 0,
    totalPrice: 450.0,
    createdAt: "2025-12-23T16:30:00",
    room: {
      roomNumber: "701",
      type: "Romantic Suite",
      capacity: 2,
      price: 150.0,
      hotel: {
        name: "Paradise Hotel & Spa",
        location: "San Francisco, CA",
        phoneNumber: "+1 (415) 555-0654",
        email: "reservations@paradisehotel.com",
      },
    },
  },
];

class BookingService {
  /**
   * Get booking history for the current user
   * @returns {Promise} Promise with booking history data
   */
  async getBookingHistory() {
    if (MOCK_ENABLED) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Filter past bookings (completed or cancelled)
      const today = new Date();
      const historyBookings = mockBookings.filter((booking) => {
        const checkOutDate = new Date(booking.checkOutDate);
        return (
          checkOutDate < today ||
          booking.status === "CANCELLED" ||
          booking.status === "COMPLETED"
        );
      });

      return {
        success: true,
        message: "Booking history retrieved successfully",
        data: historyBookings,
      };
    }

    try {
      const response = await apiClient.get("/api/user/bookings/history");
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
    if (MOCK_ENABLED) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Filter upcoming bookings (confirmed or pending, check-in date in future)
      const today = new Date();
      const upcomingBookings = mockBookings.filter((booking) => {
        const checkInDate = new Date(booking.checkInDate);
        return (
          checkInDate >= today &&
          (booking.status === "CONFIRMED" || booking.status === "PENDING")
        );
      });

      return {
        success: true,
        message: "Upcoming bookings retrieved successfully",
        data: upcomingBookings,
      };
    }

    try {
      const response = await apiClient.get("/api/user/bookings/upcoming");
      return response.data;
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
    if (MOCK_ENABLED) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const booking = mockBookings.find((b) => b.id === parseInt(bookingId));

      if (!booking) {
        throw "Booking not found";
      }

      return {
        success: true,
        message: "Booking details retrieved successfully",
        data: booking,
      };
    }

    try {
      const response = await apiClient.get(`/api/user/bookings/${bookingId}`);
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
    if (MOCK_ENABLED) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const bookingIndex = mockBookings.findIndex(
        (b) => b.id === parseInt(bookingId)
      );

      if (bookingIndex === -1) {
        throw "Booking not found";
      }

      // Update mock booking status
      mockBookings[bookingIndex].status = "CANCELLED";

      return {
        success: true,
        message: "Booking cancelled successfully",
        data: mockBookings[bookingIndex],
      };
    }

    try {
      const response = await apiClient.post(
        `/api/user/bookings/${bookingId}/cancel`
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
}

const bookingService = new BookingService();
export default bookingService;
