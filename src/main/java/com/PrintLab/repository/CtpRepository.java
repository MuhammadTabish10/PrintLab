package com.PrintLab.repository;

import com.PrintLab.model.Ctp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CtpRepository extends JpaRepository<Ctp,Long> {
    Ctp findByPlateDimension(String plateDimension);
    @Modifying
    @Query("UPDATE Ctp c SET c.status = false WHERE c.id = :id")
    void setStatusInactive(@Param("id") Long id);
}
