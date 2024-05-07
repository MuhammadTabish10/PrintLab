package com.PrintLab.repository;

import com.PrintLab.model.ProductRuleJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRuleJobRepository extends JpaRepository<ProductRuleJob, Long> {
    Boolean existsByProductName(String productName);
}
