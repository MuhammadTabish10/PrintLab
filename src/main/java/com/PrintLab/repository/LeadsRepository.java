package com.PrintLab.repository;

import com.PrintLab.model.Leads;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadsRepository extends JpaRepository<Leads,Long> {
    List<Leads> findAllByStatusIsTrue();

//    List<Leads> findLeadsByContactNameAndStatusIsTrue(String contactName);

    @Modifying
    @Query("UPDATE Leads l SET l.status = false WHERE l.id = :id")
    void setStatusFalse(Long id);

    List<Leads> findLeadsByContactNameContainingAndCompanyNameContainingAndStatusIsTrue(String contactName, String companyName);

}
