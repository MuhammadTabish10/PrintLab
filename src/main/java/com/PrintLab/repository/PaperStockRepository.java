package com.PrintLab.repository;

import com.PrintLab.model.PaperStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperStockRepository extends JpaRepository<PaperStock, Long> {
    @Query("SELECT ps FROM PaperStock ps WHERE ps.name LIKE %:searchName%")
    List<PaperStock> findPaperStockByName(@Param("searchName") String searchName);

    @Modifying
    @Query("UPDATE PaperStock ps SET ps.status = false WHERE ps.id = :id")
    void setStatusInactive(@Param("id") Long id);

}
