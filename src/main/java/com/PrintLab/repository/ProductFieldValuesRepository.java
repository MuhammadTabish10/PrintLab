package com.PrintLab.repository;

import com.PrintLab.modal.ProductFieldValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductFieldValuesRepository extends JpaRepository<ProductFieldValues, Long> {
}
