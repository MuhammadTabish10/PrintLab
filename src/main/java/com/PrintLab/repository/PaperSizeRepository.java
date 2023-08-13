package com.PrintLab.repository;

import com.PrintLab.modal.PaperSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaperSizeRepository extends JpaRepository<PaperSize,Long> {
}
