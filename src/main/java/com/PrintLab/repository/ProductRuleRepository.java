package com.PrintLab.repository;

import com.PrintLab.model.ProductRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRuleRepository extends JpaRepository<ProductRule,Long> {

    ProductRule findByTitle(String productValue);

    List<ProductRule> findProductRuleByTitle(String title);
}
