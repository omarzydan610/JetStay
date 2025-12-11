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
          }
        }
      }
    `;

    const variables = { filter, page, size };
    console.log(filter)
    console.log("Requesting rooms, page:", page, "size:", size);

    const res = await apiClient.post(
      `/graphql`,
      { query, variables },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(res.data.data.rooms)

    if (res.data?.errors) {
      console.error("GraphQL errors:", res.data.errors);
      toast.error("Failed to load rooms (GraphQL)");
      throw new Error("GraphQL query error");
    }

    const roomsPayload = res.data?.data?.rooms;

    if (!roomsPayload) return { data: [] };

    // Rooms already contain hotel info → just return directly
    return { data: roomsPayload };
  } catch (error) {
    toast.error("Failed to load rooms (GraphQL)");
    throw error;
  }
};