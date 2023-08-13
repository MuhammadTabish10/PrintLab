package com.PrintLab.repository;

import com.PrintLab.modal.ProductDefinitionProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDefinitionProcessRepository extends JpaRepository<ProductDefinitionProcess,Long> {
}
