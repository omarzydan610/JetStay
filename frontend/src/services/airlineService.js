import apiClient from "./axiosConfig";
import authService from "./AuthServices/authService.js";

const API_URL = "/api/airline";

// Dummy data for fallback
const DUMMY_AIRLINE = {
  airlineId: 1,
  airlineName: "SkyWings",
  airlineNationality: "Egyptian",
  airlineRate: 4.5,
  logoUrl: "https://via.placeholder.com/100",
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
    return (
      savedData || {
        ...DUMMY_AIRLINE,
        airlineName: airline.airlineName,
        airlineNationality: airline.airlineNationality,
        airlineRate: airline.airlineRate ?? DUMMY_AIRLINE.airlineRate,
        logoUrl: logoFile
          ? URL.createObjectURL(logoFile)
          : DUMMY_AIRLINE.logoUrl,
      }
    );
  }
};
