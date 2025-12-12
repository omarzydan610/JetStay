package com.example.backend.repository;

import com.example.backend.dto.AdminDTO.PartnerShipNameResponse;
import com.example.backend.entity.Airline;

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
public interface AirlineRepository extends JpaRepository<Airline, Integer> {

    @Query("SELECT a.airlineName FROM Airline a WHERE a.airlineID = :airlineID")
    String findNameById(@Param("airlineID") int airlineID);

    @Query(
        value = "SELECT airline_id FROM airlines WHERE airline_name = :airlineName",
        nativeQuery = true
    )
    Integer findAirlineIDByAirlineName(@Param("airlineName") String airlineName);

    boolean existsByAirlineName(String airlineName);

    Airline findByAirlineName(String airlineName);

    Optional<Airline> findByAdminUserID(Integer userID);

    @Query("SELECT a FROM Airline a WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(a.airlineName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:nationality IS NULL OR :nationality = '' OR " +
            "LOWER(a.airlineNationality) LIKE LOWER(CONCAT('%', :nationality, '%'))) AND " +
            "(:status IS NULL OR :status = '' OR a.status = :status)")
    Page<Airline> findAirlinesWithFilters(
            @Param("search") String search,
            @Param("nationality") String nationality,
            @Param("status") Airline.Status status,
            Pageable pageable);

    Optional<Airline> findByAirlineID(Integer airlineID);

    @Query("SELECT a.admin FROM Airline a WHERE a.airlineID = :airlineID")
    Optional<User> findAdminByAirlineID(@Param("airlineID") Integer airlineID);
    @Query("SELECT new com.example.backend.dto.AdminDTO.PartnerShipNameResponse(a.airlineID, a.airlineName) FROM Airline a")
    List<PartnerShipNameResponse> findAllAirline();

    
}
