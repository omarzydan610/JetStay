package com.example.backend.service.HotelService;

import com.example.backend.cache.RoomCacheManager;
import com.example.backend.dto.HotelDTO.RoomFilterDTO;
import com.example.backend.entity.RoomType;
import com.example.backend.entity.Hotel;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.RoomTypeRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoomGraphQLService {

    private final RoomCacheManager cacheManager;

    public RoomGraphQLService(RoomCacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public List<RoomType> filterRooms(RoomFilterDTO filter, RoomTypeRepository roomRepository, int page, int size) {
        List<RoomType> result = new ArrayList<>();
        int currentPage = page;

        while (result.size() < size) {
            List<RoomType> pageRooms = getRoomsPaginated(roomRepository, currentPage, size);
            if (pageRooms.isEmpty()) break;

            List<RoomType> filteredPage = pageRooms.stream()
                    .filter(r -> filterRoom(r, filter))
                    .toList();

            result.addAll(filteredPage);

            if (pageRooms.size() < size) break;
            currentPage++;
        }

        return result.size() > size ? result.subList(0, size) : result;
    }

    private boolean filterRoom(RoomType room, RoomFilterDTO filter) {
        if (filter == null) return true;

        // ===== Room-specific filters =====
        if (filter.getRoomNameContains() != null &&
                !room.getRoomTypeName().toLowerCase().contains(filter.getRoomNameContains().toLowerCase()))
            return false;

        if (filter.getPriceGte() != null && room.getPrice() < filter.getPriceGte()) return false;
        if (filter.getPriceLte() != null && room.getPrice() > filter.getPriceLte()) return false;

        // ===== Hotel-related filters (optional) =====
        Hotel hotel = room.getHotel();
        if (hotel != null) {
            if (filter.getHotelID() != null && !hotel.getHotelID().equals(filter.getHotelID())) return false;
            if (filter.getHotelNameContains() != null &&
                    !hotel.getHotelName().toLowerCase().contains(filter.getHotelNameContains().toLowerCase()))
                return false;
            if (filter.getCityContains() != null &&
                    !hotel.getCity().toLowerCase().contains(filter.getCityContains().toLowerCase()))
                return false;
            if (filter.getCountryContains() != null &&
                    !hotel.getCountry().toLowerCase().contains(filter.getCountryContains().toLowerCase()))
                return false;
            if (filter.getHotelRateGte() != null && hotel.getHotelRate() < filter.getHotelRateGte()) return false;
            if (filter.getHotelRateLte() != null && hotel.getHotelRate() > filter.getHotelRateLte()) return false;
            if (filter.getNumberOfRatesGte() != null && hotel.getNumberOfRates() < filter.getNumberOfRatesGte()) return false;
            if (filter.getNumberOfRatesLte() != null && hotel.getNumberOfRates() > filter.getNumberOfRatesLte()) return false;
            if (filter.getAdminID() != null && (hotel.getAdmin() == null || !hotel.getAdmin().getUserID().equals(filter.getAdminID())))
                return false;
            if (!hotel.getStatus().equals(Hotel.Status.ACTIVE)) return false;

            if (filter.getCreatedAfter() != null) {
                try {
                    if (!hotel.getCreatedAt().isAfter(LocalDateTime.parse(filter.getCreatedAfter()).minusSeconds(1)))
                        return false;
                } catch (DateTimeParseException e) {
                    throw new BadRequestException("Invalid createdAfter format");
                }
            }
            if (filter.getCreatedBefore() != null) {
                try {
                    if (!hotel.getCreatedAt().isBefore(LocalDateTime.parse(filter.getCreatedBefore()).plusSeconds(1)))
                        return false;
                } catch (DateTimeParseException e) {
                    throw new BadRequestException("Invalid createdBefore format");
                }
            }
            if (filter.getRoomTypeContains() != null &&
                    !room.getRoomTypeName().toLowerCase().contains(filter.getRoomTypeContains().toLowerCase()))
                return false;
        }

        return true;
    }

    public List<RoomType> getRoomsPaginated(RoomTypeRepository roomRepository, int page, int size) {
        String pageKey = page + "_" + size;

        Pageable pageable = PageRequest.of(page, size);
        List<RoomType> pageRooms = roomRepository.findAll(pageable).getContent();

        cacheManager.putRoomsPage(pageKey, pageRooms);
        return pageRooms;
    }
}