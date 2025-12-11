package com.example.backend.repository;

import com.example.backend.dto.AdminDTO.PartnerShipNameResponse;
import com.example.backend.entity.Hotel;
import com.google.api.client.http.MultipartContent.Part;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {

  Optional<Hotel> findByAdminUserID(Integer userID);
  Optional<Hotel> findByAdmin_Email(String email);

  @Query("SELECT new com.example.backend.dto.AdminDTO.PartnerShipNameResponse(h.hotelID, h.hotelName) FROM Hotel h")
  List<PartnerShipNameResponse> findAllHotel();

}
