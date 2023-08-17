package com.PrintLab.repository;

import com.PrintLab.modal.Uping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UpingRepository extends JpaRepository<Uping,Long> {
    List<Uping> findByUpingPaperSize_PaperSize_Id(Long paperSizeId);
    Uping findByProductSize(String productSize);
}
