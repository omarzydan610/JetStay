package com.example.backend.repository;

import com.example.backend.entity.BookingTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingTransactionRepository extends JpaRepository<BookingTransaction, Integer> {
}
