import { toast } from "react-toastify";
import apiClient from "../axiosConfig.js";
import authService from "../AuthServices/authService.js";

export const getRoomsGraph = async (page = 0, size = 10, filter = {}) => {
  try {
    const token = authService.getToken();

    const query = `
      query Rooms($filter: RoomFilterDTO, $page: Int, $size: Int) {
        rooms(filter: $filter, page: $page, size: $size) {
          roomTypeID
          roomTypeName
          price
          quantity
          numberOfGuests
          description
          images {
            imageID
            imageUrl
          }
          hotel {
            hotelID
            hotelName
            logoUrl
            city
            country
            hotelRate
            numberOfRates
          }
        }
      }
    `;

    const variables = { filter, page, size };
    console.log("Requesting rooms, page:", page, "filter:", filter);

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await apiClient.post(
      `/graphql`,
      { query, variables },
      { headers }
    );
    console.log(res.data)

    if (!res.data) {
      toast.error("No response from server");
      return { data: [] };
    }

    if (res.data.errors) {
      console.error("GraphQL errors:", res.data.errors);
      toast.error("Failed to load rooms (GraphQL error)");
      return { data: [] };
    }

    const roomsPayload = res.data.data?.rooms;

    if (!roomsPayload) {
      console.warn("No rooms found in response", res.data);
      return { data: [] };
    }

    return { data: roomsPayload };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    toast.error("Failed to load rooms (network/server error)");
    return { data: [] };
  }
};
