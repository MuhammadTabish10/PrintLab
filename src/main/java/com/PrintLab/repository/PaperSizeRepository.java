package com.PrintLab.repository;

import com.PrintLab.modal.Customer;
import com.PrintLab.modal.PaperSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperSizeRepository extends JpaRepository<PaperSize,Long> {
    PaperSize findByLabel(String label);
    List<PaperSize> findByStatus(String status);

}
