package com.PrintLab.repository;

import com.PrintLab.model.BusinessUnitProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessUnitProcessRepository extends JpaRepository<BusinessUnitProcess,Long> {
}
