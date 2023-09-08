package com.PrintLab.repository;

import com.PrintLab.modal.Ctp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CtpRepository extends JpaRepository<Ctp,Long> {
}
