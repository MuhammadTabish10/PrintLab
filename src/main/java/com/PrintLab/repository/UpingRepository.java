package com.PrintLab.repository;

import com.PrintLab.dto.PaginationResponse;
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
    List<Uping> findAllByStatusIsTrue();
    Page<Uping> findAllByStatusIsTrue(Pageable page);

    @Query("SELECT up FROM Uping up WHERE up.productSize LIKE %:searchName%")
    List<Uping> findUpingByProductSize(@Param("searchName") String searchName);
    @Modifying
    @Query("UPDATE Uping u SET u.status = false WHERE u.id = :id")
    void setStatusInactive(@Param("id") Long id);
}
