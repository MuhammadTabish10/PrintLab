package com.PrintLab.repository;

import com.PrintLab.model.UserPettyCash;
import com.PrintLab.model.VendorSettlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorSettlementRepository extends JpaRepository<VendorSettlement, Long> {
    @Modifying
    @Query("UPDATE VendorSettlement vs SET vs.status = false WHERE vs.id = :id")
    void setStatusInactive(@Param("id") Long id);

    @Query("SELECT vs FROM VendorSettlement vs WHERE vs.status = true ORDER BY vs.id DESC")
    List<VendorSettlement> findAllInDesOrderByIdAndStatus();

    @Query("SELECT vs FROM VendorSettlement vs JOIN vs.vendor v WHERE v.id = :vendorId AND vs.status = true")
    List<VendorSettlement> findByVendorIdAndStatus(@Param("vendorId") Long vendorId);
}
