package com.PrintLab.repository;

import com.PrintLab.modal.PressMachine;
import com.PrintLab.modal.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor,Long> {
    List<Vendor> findByVendorProcessList_ProductProcess_Id(Long productProcessId);
    Vendor findByName(String name);
    @Query("SELECT v FROM Vendor v WHERE v.name LIKE %:searchName%")
    List<Vendor> findVendorsByName(@Param("searchName") String searchName);
}
