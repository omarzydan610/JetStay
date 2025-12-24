package com.example.backend.repository;

import com.example.backend.dto.RoomTypeResponse;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomType;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {

    @Query("SELECT new com.example.backend.dto.RoomTypeResponse(rt.roomTypeID, rt.roomTypeName, rt.numberOfGuests, rt.price, rt.quantity) FROM RoomType rt WHERE rt.hotel.hotelID = :hotelId")
    public List<RoomTypeResponse> findByHotelId(@Param("hotelId") int hotelId);

    List<RoomType> findByHotel(Hotel hotel);

    @EntityGraph(attributePaths = { "hotel", "roomImages" })
    Page<RoomType> findAll(Pageable pageable);

    @Query("SELECT rt.quantity FROM RoomType rt Where rt.roomTypeID = :roomTypeID")
    public Integer quantityOfRoomType(Integer roomTypeID);


    public RoomType getByRoomTypeID(Integer RoomTypeID);

    public Hotel getHotelByRoomTypeID(Integer RoomTypeID);


    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT rt FROM RoomType rt WHERE rt.roomTypeID = :roomTypeID")
    public RoomType lockRoomType(@Param("roomTypeID") Integer roomTypeID);

}
