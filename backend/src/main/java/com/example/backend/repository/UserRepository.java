package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

        Optional<User> findByEmail(String email);

        boolean existsByEmail(String email);

        @Query("SELECT u FROM User u WHERE " +
                        "(:search IS NULL OR :search = '' OR " +
                        "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
                        "(:role IS NULL OR :role = '' OR u.role = :role) AND " +
                        "(:status IS NULL OR :status = '' OR u.status = :status)")
        Page<User> findUsersWithFilters(
                        @Param("search") String search,
                        @Param("role") User.UserRole role,
                        @Param("status") User.UserStatus status,
                        Pageable pageable);

        public User getByUserID(Integer user_id);

}
