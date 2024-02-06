package com.PrintLab.repository;

import com.PrintLab.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    List<ProductCategory> findAllByStatusIsTrue();

    @Modifying
    @Query("UPDATE ProductCategory pc SET pc.status = false WHERE pc.id = :id")
    void setStatusInactive(@Param("id") Long id);

//    List<ProductCategory> findByNameAndStatusIsTrue(String name);

    List<ProductCategory> findNameByParentProductCategoryIdAndStatusIsTrue(Long id);
}
