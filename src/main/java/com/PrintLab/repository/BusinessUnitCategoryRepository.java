package com.PrintLab.repository;

import com.PrintLab.model.BusinessUnitCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessUnitCategoryRepository extends JpaRepository<BusinessUnitCategory, Long> {
    Boolean existsByName(String name);

    List<BusinessUnitCategory> findAllByName(String name);
}
