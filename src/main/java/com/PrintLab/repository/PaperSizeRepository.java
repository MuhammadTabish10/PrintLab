package com.PrintLab.repository;

import com.PrintLab.modal.Customer;
import com.PrintLab.modal.PaperSize;
import com.PrintLab.modal.PressMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperSizeRepository extends JpaRepository<PaperSize,Long> {
    PaperSize findByLabel(String label);
    List<PaperSize> findByStatus(String status);

    @Query("SELECT ps FROM PaperSize ps WHERE ps.label LIKE %:searchLabel%")
    List<PaperSize> findPaperSizesByLabel(@Param("searchLabel") String searchLabel);

}
