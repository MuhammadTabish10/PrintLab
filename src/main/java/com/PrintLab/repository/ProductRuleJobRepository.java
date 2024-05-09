package com.PrintLab.repository;

import com.PrintLab.model.ProductRuleJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRuleJobRepository extends JpaRepository<ProductRuleJob, Long> {
    Boolean existsByProductName(String productName);

    List<ProductRuleJob> findProductRuleByProductName(String name);
}
