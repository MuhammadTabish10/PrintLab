package com.PrintLab.repository;

import com.PrintLab.modal.Customer;
import com.PrintLab.modal.PressMachine;
import com.PrintLab.modal.ProductField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFieldRepository extends JpaRepository<ProductField, Long> {
    List<ProductField> findByProductFieldValuesList_Id(Long productFieldValueId);
    List<ProductField> findAllByStatusOrderBySequenceAsc(String Status);
    ProductField findByName(String name);
    @Query("SELECT pf FROM ProductField pf WHERE pf.name LIKE %:searchName%")
    List<ProductField> findProductFieldsByName(@Param("searchName") String searchName);
}
