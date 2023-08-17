package com.PrintLab.repository;

import com.PrintLab.modal.ProductProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductProcessRepository extends JpaRepository<ProductProcess,Long>
{
    ProductProcess findByName(String name);
}
