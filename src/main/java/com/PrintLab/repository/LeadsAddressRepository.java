package com.PrintLab.repository;

import com.PrintLab.model.LeadsAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadsAddressRepository extends JpaRepository<LeadsAddress,Long> {
}
