package com.PrintLab.repository;

import com.PrintLab.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory,Long> {
    @Query("SELECT i FROM Inventory i WHERE i.paperStock LIKE %:searchName%")
    List<Inventory> findInventoryByPaperStock(@Param("searchName") String searchName);
}
