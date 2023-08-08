package com.PrintLab.repository;

import com.PrintLab.modal.UpingPaperSize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UpingPaperSizeRepository extends JpaRepository<UpingPaperSize,Long> {
    Optional<UpingPaperSize> findByUpingIdAndPaperSizeId(Long upingId, Long id);
}
