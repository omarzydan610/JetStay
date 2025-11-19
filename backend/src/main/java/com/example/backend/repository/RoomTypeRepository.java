package com.example.backend.repository;

import com.example.backend.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {

}
