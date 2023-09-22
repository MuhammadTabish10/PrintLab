package com.PrintLab.repository;

import com.PrintLab.model.ProductDefinitionSelectedValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDefinitionSelectedValuesRepository extends JpaRepository<ProductDefinitionSelectedValues,Long> {
}
