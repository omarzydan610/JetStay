package com.example.backend.repository;

import com.example.backend.entity.TicketPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketPaymentRepository extends JpaRepository<TicketPayment, Integer> {
}
