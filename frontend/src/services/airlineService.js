import apiClient from "./axiosConfig";
import authService from "./AuthServices/authService.js";

const API_URL = "/api/airline";

// Dummy data to always return in finally
const DUMMY_AIRLINE = {
  airlineId: 1,
  airlineName: "SkyWings",
  airlineNationality: "Egyptian",
  airlineRate: 4.5,
  logoUrl: "https://via.placeholder.com/100",
};

/**
 * Fetch current airline information
 * Always returns dummy data in finally
 */
export const getMyAirline = async () => {
  let data;
  try {
    const token = authService.getToken();
    const response = await apiClient.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    data = response.data;
  } catch (error) {
    console.error("Error fetching airline data:", error);
  } finally {
    return data || DUMMY_AIRLINE;
  }
};

/**
 * Save or update airline information
 * Always returns dummy data in finally
 */
export const saveAirline = async (airline, logoFile) => {
  let savedData;
  try {
    const token = authService.getToken();
    const formData = new FormData();
    formData.append("airlineName", airline.airlineName);
    formData.append("airlineNationality", airline.airlineNationality);
    formData.append("airlineRate", airline.airlineRate ?? "");
    if (logoFile) formData.append("logo", logoFile);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const method = airline.airlineId ? "put" : "post";
    const url = airline.airlineId ? `${API_URL}/${airline.airlineId}` : API_URL;

    const response = await apiClient[method](url, formData, config);
    savedData = response.data;
  } catch (error) {
    console.error("Error saving airline data:", error);
  } finally {
    return savedData || {
      ...DUMMY_AIRLINE,
      airlineName: airline.airlineName,
      airlineNationality: airline.airlineNationality,
      airlineRate: airline.airlineRate ?? DUMMY_AIRLINE.airlineRate,
      logoUrl: logoFile ? URL.createObjectURL(logoFile) : DUMMY_AIRLINE.logoUrl,
    };
  }
};
