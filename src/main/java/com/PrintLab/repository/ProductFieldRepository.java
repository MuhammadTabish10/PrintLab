package com.PrintLab.repository;

import com.PrintLab.modal.ProductField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductFieldRepository extends JpaRepository<ProductField, Long> {
}
