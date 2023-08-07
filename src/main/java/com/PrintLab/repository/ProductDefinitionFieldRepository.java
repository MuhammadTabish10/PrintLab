package com.PrintLab.repository;

import com.PrintLab.modal.ProductDefinitionField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDefinitionFieldRepository extends JpaRepository<ProductDefinitionField, Long> {
}
