package com.PrintLab.repository;

import com.PrintLab.model.Uping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UpingRepository extends JpaRepository<Uping,Long> {
    List<Uping> findByUpingPaperSize_PaperSize_Id(Long paperSizeId);
    Uping findByProductSize(String productSize);
    Uping findByProductSizeAndCategoryAndInchAndMm(String productSize, String category, String inch, String mm);
    List<Uping> findAllByStatusIsTrue();
    Page<Uping> findAllByStatusIsTrue(Pageable page);

    @Query("SELECT up FROM Uping up WHERE up.productSize LIKE %:searchName% AND up.status = true")
    Page<Uping> findUpingByProductSize(@Param("searchName") String searchName, Pageable page);
    @Modifying
    @Query("UPDATE Uping u SET u.status = false WHERE u.id = :id")
    void setStatusInactive(@Param("id") Long id);

    @Query(value = "SELECT column_name FROM information_schema.columns WHERE table_name = 'uping'", nativeQuery = true)
    List<String> getTableColumns();
}
