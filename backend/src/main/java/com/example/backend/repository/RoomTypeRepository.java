package com.example.backend.repository;

import com.example.backend.dto.RoomTypeData;
import com.example.backend.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {

    @Query("SELECT new com.example.backend.dto.RoomTypeData(rt.roomTypeID, rt.roomTypeName, rt.numberOfGuests, rt.price, rt.quantity) FROM RoomType rt WHERE rt.hotel.hotelID = :hotelId")
    public java.util.List<RoomTypeData> findByHotelId(@Param("hotelId") int hotelId);

}
