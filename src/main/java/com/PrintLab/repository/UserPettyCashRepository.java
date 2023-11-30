package com.PrintLab.repository;

import com.PrintLab.model.UserPettyCash;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPettyCashRepository extends JpaRepository<UserPettyCash, Long> {
    @Modifying
    @Query("UPDATE UserPettyCash upc SET upc.status = false WHERE upc.id = :id")
    void setStatusInactive(@Param("id") Long id);

    @Query("SELECT upc FROM UserPettyCash upc WHERE upc.status = true ORDER BY upc.id DESC")
    List<UserPettyCash> findAllInDesOrderByIdAndStatus();

    @Query("SELECT upc FROM UserPettyCash upc JOIN upc.user u WHERE u.id = :userId AND upc.status = true")
    List<UserPettyCash> findByUserIdAndStatus(@Param("userId") Long userId);
}
