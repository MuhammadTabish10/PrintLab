package com.PrintLab.repository;

import com.PrintLab.model.NewProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewProductRepository extends JpaRepository<NewProduct, Long> {
}
