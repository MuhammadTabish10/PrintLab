package com.PrintLab.repository;

import com.PrintLab.model.MasterCustomerStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterCustomerStatementRepository extends JpaRepository<MasterCustomerStatement, Long> {
}
