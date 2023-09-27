package com.PrintLab.repository;

import com.PrintLab.model.PaperSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface PaperSizeRepository extends JpaRepository<PaperSize,Long> {
    PaperSize findByLabel(String label);
    List<PaperSize> findByStatus(String status);

    @Query("SELECT ps FROM PaperSize ps WHERE ps.label LIKE %:searchLabel%")
    List<PaperSize> findPaperSizesByLabel(@Param("searchLabel") String searchLabel);
    @Modifying
    @Transactional
    @Query("UPDATE PaperSize ps SET ps.status = 'inActive' WHERE ps.id = :id")
    void setStatusInactive(@Param("id") Long id);
}
