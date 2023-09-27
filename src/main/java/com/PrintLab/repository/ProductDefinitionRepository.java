package com.PrintLab.repository;

import com.PrintLab.model.ProductDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ProductDefinitionRepository extends JpaRepository<ProductDefinition, Long> {
//    List<ProductDefinition> findByProductDefinitionFieldList_ProductField_Id(Long productDefinitionFieldId);
//    List<ProductDefinition> findByProductDefinitionProcessList_ProductProcess_Id(Long productDefinitionProcessId);
//    List<ProductDefinition> findByProductDefinitionProcessList_Vendor_Id(Long productDefinitionProcessId);
    ProductDefinition findByTitle(String title);
    List<ProductDefinition> findByStatus(Boolean status);
    @Modifying
    @Transactional
    @Query("UPDATE ProductDefinition pd SET pd.status = false WHERE pd.id = :id")
    void setStatusInactive(@Param("id") Long id);
    @Query("SELECT pd FROM ProductDefinition pd WHERE pd.title LIKE %:searchName%")
    List<ProductDefinition> findProductDefinitionsByName(@Param("searchName") String searchName);
    @Query("Select count(*) FROM ProductDefinition")
    Long getAllProductCount();
}
