package com.PrintLab.repository;

import com.PrintLab.model.ProductProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ProductProcessRepository extends JpaRepository<ProductProcess,Long>
{
    ProductProcess findByName(String name);
    List<ProductProcess> findByStatus(String status);
    @Query("SELECT pp FROM ProductProcess pp WHERE pp.name LIKE %:searchName%")
    List<ProductProcess> findProductProcessByName(@Param("searchName") String searchName);
    @Modifying
    @Query("UPDATE ProductProcess pp SET pp.status = 'inActive' WHERE pp.id = :id")
    void setStatusInactive(@Param("id") Long id);
}
