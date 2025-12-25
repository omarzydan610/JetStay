package com.example.backend.repository;

import com.example.backend.entity.RoomPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomPaymentRepository extends JpaRepository<RoomPayment, Integer> {
}
