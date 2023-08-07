package com.PrintLab.repository;

import com.PrintLab.modal.ProductDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDefinitionRepository extends JpaRepository<ProductDefinition, Long> {
}
