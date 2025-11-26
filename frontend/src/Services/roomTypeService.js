// src/services/roomTypeService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Configure axios instance with JWT interceptor
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

class RoomTypeService {
    // Transform frontend data to match backend DTO
    transformToDTO(data) {
        const dto = {};

        // Map frontend fields to backend DTO fields
        if (data.name !== undefined && data.name !== '') {
            dto.roomTypeName = data.name;
        }
        if (data.description !== undefined && data.description !== '') {
            dto.description = data.description;
        }
        if (data.capacity !== undefined && data.capacity !== null) {
            dto.numberOfGuests = data.capacity;
        }
        if (data.basePrice !== undefined && data.basePrice !== null) {
            dto.price = data.basePrice;
        }
        if (data.quantity !== undefined && data.quantity !== null) {
            dto.quantity = data.quantity;
        }
        // Note: hotelId is handled by backend from JWT token
        // Note: amenities are not in the DTO, handle separately if needed

        return dto;
    }

    // Create room type
    async addRoomType(data) {
        const dto = this.transformToDTO(data);
        const response = await api.post('/api/room-type/add', dto);
        return response.data;
    }

    // Get all room types
    async getAllRoomTypes() {
        const response = await api.get('/api/room-type/all');
        return response.data;
    }

    // Get room type by ID
    async getRoomTypeById(id) {
        const response = await api.get(`/api/room-type/${id}`);
        return response.data;
    }

    // Update room type
    async updateRoomType(id, data) {
        const dto = this.transformToDTO(data);
        const response = await api.put(`/api/room-type/update/${id}`, dto);
        return response.data;
    }

    // Delete room type
    async deleteRoomType(id) {
        const response = await api.delete(`/api/room-type/delete/${id}`);
        return response.data;
    }
}

export default new RoomTypeService();

// src/services/roomTypeService.js
// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// // Mock data for testing
// const mockRoomTypes = [
//     {
//         id: 1,
//         name: 'Deluxe Suite',
//         description: 'Spacious suite with king bed and ocean view',
//         capacity: 2,
//         basePrice: 299.99,
//         quantity: 10,
//         amenities: ['WiFi', 'TV', 'Mini Bar', 'Room Service', 'Sea View'],
//         createdAt: '2024-01-15T10:30:00',
//         updatedAt: '2024-01-15T10:30:00'
//     },
//     {
//         id: 2,
//         name: 'Standard Room',
//         description: 'Comfortable room with queen bed',
//         capacity: 2,
//         basePrice: 149.99,
//         quantity: 25,
//         amenities: ['WiFi', 'TV', 'Air Conditioning'],
//         createdAt: '2024-01-16T11:20:00',
//         updatedAt: '2024-01-16T11:20:00'
//     },
//     {
//         id: 3,
//         name: 'Family Room',
//         description: 'Large room perfect for families with two queen beds',
//         capacity: 4,
//         basePrice: 249.99,
//         quantity: 15,
//         amenities: ['WiFi', 'TV', 'Mini Fridge', 'Coffee Maker'],
//         createdAt: '2024-01-17T09:15:00',
//         updatedAt: '2024-01-17T09:15:00'
//     },
//     {
//         id: 4,
//         name: 'Presidential Suite',
//         description: 'Luxury suite with separate living area and premium amenities',
//         capacity: 4,
//         basePrice: 599.99,
//         quantity: 3,
//         amenities: ['WiFi', 'Smart TV', 'Mini Bar', 'Room Service', 'Jacuzzi', 'Butler Service'],
//         createdAt: '2024-01-18T14:45:00',
//         updatedAt: '2024-01-18T14:45:00'
//     },
//     {
//         id: 5,
//         name: 'Economy Single',
//         description: 'Budget-friendly single room',
//         capacity: 1,
//         basePrice: 89.99,
//         quantity: 20,
//         amenities: ['WiFi', 'TV'],
//         createdAt: '2024-01-19T08:00:00',
//         updatedAt: '2024-01-19T08:00:00'
//     }
// ];

// // Flag to enable/disable mock mode
// const USE_MOCK_DATA = true; // Set to false when API is ready

// // Configure axios instance with JWT interceptor
// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Add JWT token to requests
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('jwt_token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Simulate API delay
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// class RoomTypeService {
//     constructor() {
//         this.mockData = [...mockRoomTypes];
//         this.nextId = 6;
//     }

//     // Transform frontend data to match backend DTO
//     transformToDTO(data) {
//         const dto = {};

//         // Map frontend fields to backend DTO fields
//         if (data.name !== undefined && data.name !== '') {
//             dto.roomTypeName = data.name;
//         }
//         if (data.description !== undefined && data.description !== '') {
//             dto.description = data.description;
//         }
//         if (data.capacity !== undefined && data.capacity !== null) {
//             dto.numberOfGuests = data.capacity;
//         }
//         if (data.basePrice !== undefined && data.basePrice !== null) {
//             dto.price = data.basePrice;
//         }
//         if (data.quantity !== undefined && data.quantity !== null) {
//             dto.quantity = data.quantity;
//         }
//         // Note: hotelId is handled by backend from JWT token
//         // Note: amenities are not in the DTO, handle separately if needed

//         return dto;
//     }

//     // Create room type
//     async addRoomType(data) {
//         if (USE_MOCK_DATA) {
//             await delay(500); // Simulate network delay
//             const newRoomType = {
//                 id: this.nextId++,
//                 name: data.name,
//                 description: data.description,
//                 capacity: data.capacity,
//                 basePrice: data.basePrice,
//                 quantity: data.quantity,
//                 amenities: data.amenities || [],
//                 createdAt: new Date().toISOString(),
//                 updatedAt: new Date().toISOString()
//             };
//             this.mockData.push(newRoomType);
//             return { success: true, message: 'Room type created successfully', data: null };
//         }

//         const dto = this.transformToDTO(data);
//         const response = await api.post('/api/room-type/add', dto);
//         return response.data;
//     }

//     // Get all room types
//     async getAllRoomTypes() {
//         if (USE_MOCK_DATA) {
//             await delay(300); // Simulate network delay
//             return { success: true, data: [...this.mockData] };
//         }

//         const response = await api.get('/api/room-type/all');
//         return response.data;
//     }

//     // Get room type by ID
//     async getRoomTypeById(id) {
//         if (USE_MOCK_DATA) {
//             await delay(300);
//             const roomType = this.mockData.find(rt => rt.id === id);
//             if (roomType) {
//                 return { success: true, data: roomType };
//             }
//             throw new Error('Room type not found');
//         }

//         const response = await api.get(`/api/room-type/${id}`);
//         return response.data;
//     }

//     // Update room type
//     async updateRoomType(id, data) {
//         if (USE_MOCK_DATA) {
//             await delay(500);
//             const index = this.mockData.findIndex(rt => rt.id === id);
//             if (index !== -1) {
//                 this.mockData[index] = {
//                     ...this.mockData[index],
//                     name: data.name,
//                     description: data.description,
//                     capacity: data.capacity,
//                     basePrice: data.basePrice,
//                     quantity: data.quantity,
//                     amenities: data.amenities || this.mockData[index].amenities,
//                     updatedAt: new Date().toISOString()
//                 };
//                 return { success: true, message: 'Room type updated successfully', data: null };
//             }
//             throw new Error('Room type not found');
//         }

//         const dto = this.transformToDTO(data);
//         const response = await api.put(`/api/room-type/update/${id}`, dto);
//         return response.data;
//     }

//     // Delete room type
//     async deleteRoomType(id) {
//         if (USE_MOCK_DATA) {
//             await delay(500);
//             const index = this.mockData.findIndex(rt => rt.id === id);
//             if (index !== -1) {
//                 this.mockData.splice(index, 1);
//                 return { success: true, message: 'Room type deleted successfully', data: null };
//             }
//             throw new Error('Room type not found');
//         }

//         const response = await api.delete(`/api/room-type/delete/${id}`);
//         return response.data;
//     }
// }

// export default new RoomTypeService();