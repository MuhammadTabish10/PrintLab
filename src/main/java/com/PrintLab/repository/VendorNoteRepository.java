package com.PrintLab.repository;

import com.PrintLab.model.VendorNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorNoteRepository extends JpaRepository<VendorNote, Long> {
    List<VendorNote> findAllByVendorId(Long vendorId);
}
