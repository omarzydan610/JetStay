package com.example.backend.repository;

import com.example.backend.entity.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoomImageRepository extends JpaRepository<RoomImage, Integer> {

}
