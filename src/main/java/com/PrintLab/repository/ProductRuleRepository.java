package com.PrintLab.repository;

import com.PrintLab.model.Customer;
import com.PrintLab.model.ProductRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRuleRepository extends JpaRepository<ProductRule,Long> {

    @Query("SELECT p FROM ProductRule p WHERE p.title LIKE %:searchName%")
    List<ProductRule> findProductRuleByTitle(@Param("searchName") String searchName);

    ProductRule findByTitle(String title);

}
