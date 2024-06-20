package com.PrintLab.repository;

import com.PrintLab.model.JobProcessedDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobProcessedDetailsRepository extends JpaRepository<JobProcessedDetails, Long> {

    List<JobProcessedDetails> findByProductRuleIdAndJobProcessedIsTrue(Long id);

    List<JobProcessedDetails> findByVendor(String vendor);

    @Query("SELECT j FROM JobProcessedDetails j WHERE j.vendor = :vendor AND j.dateAdded BETWEEN :startDate AND :endDate")
    List<JobProcessedDetails> findByVendorAndDateRange(
            @Param("vendor") String vendor,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
