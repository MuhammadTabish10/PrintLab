package com.PrintLab.repository;

import com.PrintLab.modal.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor,Long> {
    List<Vendor> findByVendorProcessList_ProductProcess_Id(Long productProcessId);
    Vendor findByName(String name);
}
