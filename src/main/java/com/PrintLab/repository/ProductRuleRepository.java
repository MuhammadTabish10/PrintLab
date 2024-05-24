package com.PrintLab.repository;

import com.PrintLab.model.ProductRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRuleRepository extends JpaRepository<ProductRule,Long> {
    List<ProductRule> findByStatus(String active);
//    List<ProductRule> findProductRuleByProductName(String productName);
    ProductRule findByProductNameAndStatus(String productValue, String active);
    List<ProductRule> findByTypeAndStatus(String type, String active);
    Boolean existsByProductNameAndStatusAndType(String productName, String active, String type);
    List<ProductRule> findByTypeAndStatusAndGroupSheetTrue(String type, String status);

    List<ProductRule> findProductRuleByProductNameAndTypeAndStatus(String productName, String type, String status);
}
