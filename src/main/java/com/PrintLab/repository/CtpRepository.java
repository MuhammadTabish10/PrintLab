package com.PrintLab.repository;

import com.PrintLab.model.Ctp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CtpRepository extends JpaRepository<Ctp,Long> {


    Ctp findByPlateDimension(String plateDimension);
}
