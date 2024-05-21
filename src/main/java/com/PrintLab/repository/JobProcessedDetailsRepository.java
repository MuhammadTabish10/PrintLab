package com.PrintLab.repository;

import com.PrintLab.model.JobProcessedDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobProcessedDetailsRepository extends JpaRepository<JobProcessedDetails, Long> {

    List<JobProcessedDetails> findByProductRuleIdAndJobProcessedIsTrue(Long id);
}
