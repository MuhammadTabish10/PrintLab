package com.PrintLab.repository;

import com.PrintLab.model.Leads;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface LeadsRepository extends JpaRepository<Leads, Long> {
//    List<Leads> findAllByStatusIsTrue();

//    List<Leads> findLeadsByContactNameAndStatusIsTrue(String contactName);


    List<Leads> findLeadsByContactNameContainingAndCompanyNameContainingAndStatusIsTrue(String contactName, String companyName);

    List<Leads> findLeadsByCompanyNameContainingAndStatusIsTrue(String companyName);

    @Modifying
    @Query("UPDATE Leads l SET l.status = false WHERE l.id = :id")
    void setStatusFalse(Long id);

    Page<Leads> findAllByStatusIsTrue(Pageable page);

    @Query(value = "SELECT " +
            "GROUP_CONCAT(DISTINCT lead_status_type) AS lead_status_type " +
            "FROM leads",
            nativeQuery = true)
    Map<String, String> findAllDistinctValues();
}
