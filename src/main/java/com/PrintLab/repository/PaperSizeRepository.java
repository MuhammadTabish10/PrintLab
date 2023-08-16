package com.PrintLab.repository;

import com.PrintLab.modal.PaperSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperSizeRepository extends JpaRepository<PaperSize,Long> {
    List<PaperSize> findByLabel(String label);
}
