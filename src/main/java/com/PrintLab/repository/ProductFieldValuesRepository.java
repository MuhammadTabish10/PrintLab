package com.PrintLab.repository;

import com.PrintLab.modal.ProductField;
import com.PrintLab.modal.ProductFieldValues;
import com.PrintLab.modal.ProductProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFieldValuesRepository extends JpaRepository<ProductFieldValues, Long> {
    List<ProductFieldValues> findByproductField_Id(Long productFieldId);
    ProductFieldValues findByName(String name);
    ProductFieldValues findByProductFieldAndName(ProductField productField, String name);
    List<ProductFieldValues> findByStatus(String status);
}
