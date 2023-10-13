package com.PrintLab.repository;

import com.PrintLab.model.ProductRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRuleRepository extends JpaRepository<ProductRule,Long> {
}
