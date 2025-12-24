import apiClient from "../axiosConfig.js";
import authService from "../AuthServices/authService.js";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/flight";

export const getFlights = async (page = 0, size = 10) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size },
    });
    console.log("Fetched flights:", res.data);
    return res.data;
  } catch (error) {
    toast.error("Failed to load flights");
    throw error;
  }
};

/**
 * GraphQL-based flights query. This keeps the original REST `getFlights` intact
 * while providing a way to pass rich `filter` objects to the backend GraphQL API.
 *
 * Note: GraphQL endpoint is assumed to be available at `/graphql` on the
 * configured API base URL. The returned shape is `{ data: [...] }` to remain
 * similar to the REST variant used elsewhere.
 */
export const getFlightsGraph = async (page = 0, size = 10, filter = {}) => {
  try {
    const token = authService.getToken();
    

    const query = `
      query Flights($filter: FlightFilterDTO, $page: Int, $size: Int) {
        flights(filter: $filter, page: $page, size: $size) {
          flightID
          status
          planeType
          departureDate
          arrivalDate
          departureAirport {
            airportName
            city
            country
          }
          arrivalAirport {
            airportName
            city
            country
          }
          airline {
            airlineID
            airlineName
            airlineRate
            airlineNationality
          }
          tripsTypes {
            typeName
            price
          }
        }
      }
    `;

    const variables = { filter, page, size };
    console.log(size)

    const res = await apiClient.post(
      `/graphql`,
      { query, variables },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data && res.data.errors) {
      console.error("GraphQL errors:", res.data.errors);
      toast.error("Failed to load flights (GraphQL)");
      throw new Error("GraphQL query error");
    }
    console.log(res.data.data)

    // GraphQL can return either:
    // 1) an array directly in `data.flights` or
    // 2) a paginated object like `data.flights = { content: [...], totalPages, totalElements }`.
    const flightsPayload = res.data?.data?.flights;

    if (!flightsPayload) return { data: [] };

    // Case: paginated object
    if (typeof flightsPayload === "object" && Array.isArray(flightsPayload.content)) {
      return { data: flightsPayload.content, totalPages: flightsPayload.totalPages };
    }

    // Case: direct array
    if (Array.isArray(flightsPayload)) {
      return { data: flightsPayload };
    }

    // Fallback
    return { data: [] };
  } catch (error) {
    toast.error("Failed to load flights (GraphQL)");
    throw error;
  }
};

export const createFlight = async (flightData) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.post(`${API_URL}/add`, flightData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Flight created successfully!");
    return res.data;
  } catch (error) {
    toast.error("Failed to create flight");
    throw error;
  }
};

export const updateFlight = async (id, flightData) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.patch(`${API_URL}/update/${id}`, flightData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Flight updated successfully!");
    return res.data;
  } catch (error) {
    toast.error("Failed to update flight");
    throw error;
  }
};

export const deleteFlight = async (id) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.delete(`${API_URL}/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Flight deleted successfully!");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete flight");
    throw error;
  }
};

export async function getCountries() {
  const token = authService.getToken();
  const res = await apiClient.get(`${API_URL}/countries`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Fetched countries:", res.data);
  return res.data;
}

/**
 * Backend endpoint:
 * GET /api/flight/cities?country=Australia
 */
export async function getCities(countryName) {
  const token = authService.getToken();
  const res = await apiClient.get(`${API_URL}/cities`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { country: countryName },
  });

  console.log("Fetched cities:", res.data);
  return res.data;
}

/**
 * Backend endpoint:
 * GET /api/flight/airPorts?country=Australia&city=Sydney
 */
export async function getAirports(countryName, cityName) {
  const token = authService.getToken();
  const res = await apiClient.get(`${API_URL}/airPorts`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { country: countryName, city: cityName },
  });

  console.log("Fetched airports:", res.data);
  return res.data;
}

/**
 * Backend endpoint:
 * GET /api/flight/ticket-types
 */
export async function getTicketTypes() {
  const token = authService.getToken();
  const res = await apiClient.get(`${API_URL}/ticket-types`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Fetched ticket types:", res.data);
  return res.data;
}

export const getFlightDetails = async (id) => {
  try {
    console.log(id)
    const token = authService.getToken();
    const res = await apiClient.get(`${API_URL}/details/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch flight details");
    throw error;
  }
};

/**
 * Add flight offer
 * POST /api/flight/{flightId}/offers/add
 */
export const addFlightOffer = async (flightId, offerData) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.post(`${API_URL}/${flightId}/offers/add`, offerData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to add flight offer");
    throw error;
  }
};

/**
 * Get flight offers (public access)
 * GET /api/flight/{flightId}/offers/public
 */
export const getPublicFlightOffers = async (flightId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(`${API_URL}/${flightId}/offers/public`,{
      headers: { Authorization: `Bearer ${token}` }
  });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch flight offers:", error);
    return { data: [] };
  }
};

/**
 * Get flight offers
 * GET /api/flight/{flightId}/offers
 */
export const getFlightOffers = async (flightId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(`${API_URL}/${flightId}/offers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch flight offers");
    throw error;
  }
};

/**
 * Delete flight offer
 * DELETE /api/flight/offers/delete/{offerId}
 */
export const deleteFlightOffer = async (offerId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.delete(`${API_URL}/offers/delete/${offerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to delete flight offer");
    throw error;
  }
};
