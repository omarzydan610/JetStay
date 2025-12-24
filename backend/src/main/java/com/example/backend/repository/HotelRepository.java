package com.example.backend.repository;

import com.example.backend.dto.AdminDTO.PartnerShipNameResponse;
import com.example.backend.entity.Hotel;
import com.google.api.client.http.MultipartContent.Part;

import java.util.List;
import java.util.Optional;

import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {

  Optional<Hotel> findByAdminUserID(Integer userID);
  Optional<Hotel> findByAdmin_Email(String email);

  @Query("SELECT h FROM Hotel h WHERE " +
          "(:search IS NULL OR :search = '' OR " +
          "LOWER(h.hotelName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
          "(:city IS NULL OR :city = '' OR " +
          "LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
          "(:country IS NULL OR :country = '' OR " +
          "LOWER(h.country) LIKE LOWER(CONCAT('%', :country, '%'))) AND " +
          "(:status IS NULL OR h.status = :status)")
  Page<Hotel> findHotelsWithFilters(
          @Param("search") String search,
          @Param("city") String city,
          @Param("country") String country,
          @Param("status") Hotel.Status status,
          Pageable pageable);

  Optional<Hotel> findByHotelID(Integer hotelID);

  @Query("SELECT h.admin FROM Hotel h WHERE h.hotelID = :hotelID")
  Optional<User> findAdminByHotelID(@Param("hotelID") Integer hotelID);
  @Query("SELECT new com.example.backend.dto.AdminDTO.PartnerShipNameResponse(h.hotelID, h.hotelName) FROM Hotel h")
  List<PartnerShipNameResponse> findAllHotel();


  Hotel getByHotelID(Integer hotelID);

}
