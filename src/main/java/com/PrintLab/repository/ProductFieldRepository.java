package com.PrintLab.repository;

import com.PrintLab.modal.ProductField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFieldRepository extends JpaRepository<ProductField, Long> {
    List<ProductField> findByProductFieldValuesList_Id(Long productFieldValueId);
}
