import apiClient from "./axiosConfig";

class BookingService {
  // ==================== Hotel Booking Methods ====================

  /**
   * Get hotel booking history for the current user
   * @returns {Promise} Promise with hotel booking history data
   */
  async getHotelBookingHistory() {
    try {
      const response = await apiClient.get("/api/bookings/hotel/history");
      const bookingsData = response.data.data || response.data || [];
      return { data: bookingsData.map((booking) => this.normalizeHotelBooking(booking)) };
    } catch (error) {
      console.error("Error fetching hotel booking history:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get upcoming hotel bookings for the current user
   * @returns {Promise} Promise with upcoming hotel bookings data
   */
  async getUpcomingHotelBookings() {
    try {
      const response = await apiClient.get("/api/bookings/hotel/upcoming");
      const bookingsData = response.data.data || response.data || [];
      return { data: bookingsData.map((booking) => this.normalizeHotelBooking(booking)) };
    } catch (error) {
      console.error("Error fetching upcoming hotel bookings:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get hotel booking details by transaction ID
   * @param {number} bookingTransactionId - The booking transaction ID
   * @returns {Promise} Promise with hotel booking details
   */
  async getHotelBookingDetails(bookingTransactionId) {
    try {
      const response = await apiClient.get(`/api/bookings/hotel/${bookingTransactionId}`);
      const bookingData = response.data.data || response.data;
      return { data: this.normalizeHotelBooking(bookingData) };
    } catch (error) {
      console.error("Error fetching hotel booking details:", error);
      throw this.handleError(error);
    }
  }

  // ==================== Flight Ticket Methods ====================

  /**
   * Get flight ticket history for the current user
   * @returns {Promise} Promise with flight ticket history data
   */
  async getFlightTicketHistory() {
    try {
      const response = await apiClient.get("/api/bookings/flight/history");
      const ticketsData = response.data.data || response.data || [];
      return { data: ticketsData.map((ticket) => this.normalizeFlightTicket(ticket)) };
    } catch (error) {
      console.error("Error fetching flight ticket history:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get upcoming flight tickets for the current user
   * @returns {Promise} Promise with upcoming flight tickets data
   */
  async getUpcomingFlightTickets() {
    try {
      const response = await apiClient.get("/api/bookings/flight/upcoming");
      const ticketsData = response.data.data || response.data || [];
      return { data: ticketsData.map((ticket) => this.normalizeFlightTicket(ticket)) };
    } catch (error) {
      console.error("Error fetching upcoming flight tickets:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get flight ticket details by ticket ID
   * @param {number} ticketId - The flight ticket ID
   * @returns {Promise} Promise with flight ticket details
   */
  async getFlightTicketDetails(ticketId) {
    try {
      const response = await apiClient.get(`/api/bookings/flight/${ticketId}`);
      const ticketData = response.data.data || response.data;
      return { data: this.normalizeFlightTicket(ticketData) };
    } catch (error) {
      console.error("Error fetching flight ticket details:", error);
      throw this.handleError(error);
    }
  }

  // ==================== Combined Methods (for backward compatibility) ====================

  /**
   * Get all booking history (both hotel and flight)
   * @returns {Promise} Promise with all booking history data
   */
  async getBookingHistory() {
    try {
      const [hotelResponse, flightResponse] = await Promise.all([
        this.getHotelBookingHistory(),
        this.getFlightTicketHistory()
      ]);

      const allBookings = [
        ...(hotelResponse.data || []),
        ...(flightResponse.data || [])
      ];

      // Sort by creation date, most recent first
      allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return { data: allBookings };
    } catch (error) {
      console.error("Error fetching booking history:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get all upcoming bookings (both hotel and flight)
   * @returns {Promise} Promise with all upcoming bookings data
   */
  async getUpcomingBookings() {
    try {
      const [hotelResponse, flightResponse] = await Promise.all([
        this.getUpcomingHotelBookings(),
        this.getUpcomingFlightTickets()
      ]);

      const allBookings = [
        ...(hotelResponse.data || []),
        ...(flightResponse.data || [])
      ];

      // Sort by date (check-in for hotels, flight date for flights)
      allBookings.sort((a, b) => {
        const dateA = new Date(a.checkInDate || a.flightDate);
        const dateB = new Date(b.checkInDate || b.flightDate);
        return dateA - dateB;
      });

      return { data: allBookings };
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
      // Extract the booking data from the SuccessResponse wrapper
      const bookingData = response.data.data || response.data;
      // Normalize the booking data to match frontend expectations
      return { data: this.normalizeBooking(bookingData) };
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Cancel a booking
   * Cancel a booking (placeholder - needs backend implementation)
   * @param {number} bookingId - The booking ID to cancel
   * @returns {Promise} Promise with cancellation result
   */
  async cancelBooking(bookingId) {
    try {
      const response = await apiClient.post(`/api/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error canceling booking:", error);
      throw this.handleError(error);
    }
  }

  // ==================== Normalization Methods ====================

  /**
   * Normalize hotel booking data from new API structure
   * New structure: { bookingTransaction: {...}, roomBooking: [{...}] }
   */
  normalizeHotelBooking(booking) {
    if (!booking || !booking.bookingTransaction) {
      return null;
    }

    const transaction = booking.bookingTransaction;
    const rooms = booking.roomBooking || [];
    const firstRoom = rooms[0] || {};

    return {
      id: transaction.bookingTransactionId,
      bookingTransactionId: transaction.bookingTransactionId,
      type: "HOTEL",
      status: transaction.status,
      checkInDate: transaction.checkIn,
      checkOutDate: transaction.checkOut,
      totalPrice: transaction.totalPrice,
      createdAt: transaction.bookingDate,
      numberOfGuests: transaction.numberOfGuests,
      numberOfRooms: transaction.numberOfRooms,
      isPaid: transaction.isPaid,
      room: {
        type: firstRoom.roomType || "N/A",
        capacity: firstRoom.noOfRooms || 0,
        price: firstRoom.price || 0,
        hotel: transaction.hotel ? {
          id: transaction.hotel.hotelID,
          name: transaction.hotel.hotelName,
          city: transaction.hotel.city,
          country: transaction.hotel.country,
          location: `${transaction.hotel.city}, ${transaction.hotel.country}`,
        } : null,
      },
      rooms: rooms, // All rooms for this transaction
      __raw: booking,
    };
  }

  /**
   * Normalize flight ticket data from new API structure
   * New structure: FlightTicketResponse DTO
   */
  normalizeFlightTicket(ticket) {
    if (!ticket) {
      return null;
    }

    return {
      id: ticket.ticketId,
      ticketId: ticket.ticketId,
      type: "FLIGHT",
      status: ticket.isPaid ? "CONFIRMED" : "PENDING",
      state: ticket.state,
      flightDate: ticket.flightDate,
      checkInDate: ticket.flightDate, // For compatibility with UI components
      checkOutDate: ticket.flightDate,
      totalPrice: ticket.price,
      createdAt: ticket.createdAt,
      isPaid: ticket.isPaid,
      ticket: {
        class: ticket.tripType,
        type: ticket.tripType,
        price: ticket.tripPrice,
        flight: {
          id: ticket.flightId,
          airline: {
            id: ticket.airlineId,
            name: ticket.airlineName,
            nationality: ticket.airlineNationality,
          },
          from: ticket.departureCity,
          to: ticket.arrivalCity,
          departureCity: ticket.departureCity,
          arrivalCity: ticket.arrivalCity,
          departureAirport: ticket.departureAirport,
          arrivalAirport: ticket.arrivalAirport,
          departureDate: ticket.departureDate,
          arrivalDate: ticket.arrivalDate,
          departureTime: ticket.departureDate,
          arrivalTime: ticket.arrivalDate,
        },
      },
      __raw: ticket,
    };
  }

  /**
   * Handle API errors
   * @param {Error} error - The error object
   * @returns {string} Error message
   */
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || "An error occurred";
      return message;
    } else if (error.request) {
      return "No response from server. Please check your connection.";
    } else {
      return error.message || "An unexpected error occurred";
    }
  }
}

const bookingService = new BookingService();
export default bookingService;
