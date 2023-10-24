package com.PrintLab.repository;

import com.PrintLab.model.Ctp;
import com.PrintLab.model.Uping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CtpRepository extends JpaRepository<Ctp,Long> {
    Ctp findByPlateDimension(String plateDimension);
    List<Ctp> findAllByStatusIsTrue();
    @Modifying
    @Query("UPDATE Ctp c SET c.status = false WHERE c.id = :id")
    void setStatusInactive(@Param("id") Long id);
}
