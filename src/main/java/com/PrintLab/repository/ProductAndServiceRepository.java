package com.PrintLab.repository;

import com.PrintLab.model.ProductAndService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductAndServiceRepository extends JpaRepository<ProductAndService, Long> {
    List<ProductAndService> findAllByStatusIsTrue();

    @Modifying
    @Query("UPDATE ProductAndService ps SET ps.status = false WHERE ps.id = :id")
    void setStatusInactive(@Param("id") Long id);
}
