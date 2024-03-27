package com.PrintLab.repository;

import com.PrintLab.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessRepository extends JpaRepository<Business,Long> {
    boolean existsByBusinessName(String businessName);
}
