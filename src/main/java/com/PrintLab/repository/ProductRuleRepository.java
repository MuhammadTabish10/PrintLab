package com.PrintLab.repository;

import com.PrintLab.model.ProductRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRuleRepository extends JpaRepository<ProductRule,Long> {
    List<ProductRule> findByStatus(String active);
    List<ProductRule> findProductRuleByProductName(String productName);
    ProductRule findByProductNameAndStatus(String productValue, String active);
    Boolean existsByProductNameAndStatus(String productName, String active);

    List<ProductRule> findAllAndGroupSheetIsTrue();
}
