package com.PrintLab.repository;

import com.PrintLab.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByVendorProcessList_ProductProcess_Id(Long productProcessId);

    Vendor findByName(String name);

    @Query("SELECT v FROM Vendor v WHERE v.name LIKE %:searchName%")
    List<Vendor> findVendorsByName(@Param("searchName") String searchName);

    List<Vendor> findAllByStatusIsTrue();

    @Query("Select count(*) FROM Vendor")
    Long getAllVendorCount();

    @Modifying
    @Query("UPDATE Vendor v SET v.status = false WHERE v.id = :id")
    void setStatusInactive(@Param("id") Long id);

    List<Vendor> findByVendorProcessList_ProductProcess_NameAndStatusIsTrue(String process);
}
