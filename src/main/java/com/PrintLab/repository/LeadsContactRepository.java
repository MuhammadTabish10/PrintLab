package com.PrintLab.repository;

import com.PrintLab.model.LeadsContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadsContactRepository extends JpaRepository<LeadsContact,Long> {
}
