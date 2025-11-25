package com.example.backend.repository;

import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;



@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
  List<RoomType> findByHotel(Hotel hotel);
}
