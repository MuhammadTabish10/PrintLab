package com.PrintLab.repository;

import com.PrintLab.modal.PaperSize;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperSizeRepository extends JpaRepository<PaperSize,Long> {
}
