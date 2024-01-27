package com.PrintLab.repository;

import com.PrintLab.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    List<Invoice> findAllByStatusIsTrue();

    List<Invoice> findInvoiceByInvoiceNoAndStatusIsTrue(Long invoiceNo);

    @Modifying
    @Query("UPDATE Invoice i SET i.status = false WHERE i.id = :id")
    void setStatusFalse(@Param("id") Long id);
}
