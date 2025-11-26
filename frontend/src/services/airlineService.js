import apiClient from "./axiosConfig";

const API_URL = "http://localhost:8080/api/airline";

export const getMyAirline = async () => {
  try {
    return await apiClient.get(`${API_URL}/me`);
  } catch (err) {
    console.warn("Backend not available, using dummy airline data");
    return {
      data: {
        airlineId: 1,
        airlineName: "SkyWings",
        airlineNationality: "Egyptian",
        airlineRate: 4.5,
        logoUrl: "https://via.placeholder.com/100",
      },
    };
  }
};

export const saveAirline = async (airline, logoFile) => {
  const formData = new FormData();
  formData.append("airlineName", airline.airlineName);
  formData.append("airlineNationality", airline.airlineNationality);
  formData.append("airlineRate", airline.airlineRate ?? "");
  if (logoFile) {
    formData.append("logo", logoFile);
  }

  if (airline.airlineId) {
    return await apiClient.put(`${API_URL}/${airline.airlineId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    return await apiClient.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
};
