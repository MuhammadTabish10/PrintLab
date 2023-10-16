package com.PrintLab.repository;

import com.PrintLab.model.ProductRulePaperStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRulePaperStockRepository extends JpaRepository<ProductRulePaperStock, Long> {
}
