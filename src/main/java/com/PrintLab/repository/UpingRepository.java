package com.PrintLab.repository;

import com.PrintLab.modal.Uping;
import com.PrintLab.modal.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UpingRepository extends JpaRepository<Uping,Long> {
    List<Uping> findByUpingPaperSize_PaperSize_Id(Long paperSizeId);
    Uping findByProductSize(String productSize);
    @Query("SELECT up FROM Uping up WHERE up.productSize LIKE %:searchName%")
    List<Uping> findUpingByProductSize(@Param("searchName") String searchName);
}
