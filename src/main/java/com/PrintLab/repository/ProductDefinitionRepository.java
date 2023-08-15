package com.PrintLab.repository;

import com.PrintLab.modal.ProductDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDefinitionRepository extends JpaRepository<ProductDefinition, Long> {
    List<ProductDefinition> findByProductDefinitionFieldList_ProductField_Id(Long productDefinitionFieldId);
    List<ProductDefinition> findByProductDefinitionProcessList_ProductProcess_Id(Long productDefinitionProcessId);
    List<ProductDefinition> findByProductDefinitionProcessList_Vendor_Id(Long productDefinitionProcessId);
}
