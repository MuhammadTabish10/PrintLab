package com.PrintLab.repository;

import com.PrintLab.model.PressMachine;
import com.PrintLab.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface PressMachineRepository extends JpaRepository<PressMachine,Long>
{
    List<PressMachine> findByPressMachineSize_PaperSize_Id(Long paperSizeId);
    PressMachine findByName(String name);
    @Query("SELECT DISTINCT p.name FROM PressMachine p")
    List<String> findDistinctNames();
    @Query("SELECT p.vendor from PressMachine p WHERE p.name = :name")
    Vendor findVendorByName(@Param("name") String name);
    @Query("SELECT pm FROM PressMachine pm where pm.is_selected = true")
    PressMachine findSelectedPressMachine();
    List<PressMachine> findByStatus(String status);
    @Modifying
    @Transactional
    @Query("UPDATE PressMachine pm SET pm.is_selected = false")
    void unselectAllPressMachines();

    @Query("SELECT pm FROM PressMachine pm WHERE pm.name LIKE %:searchName%")
    List<PressMachine> findPressMachinesByName(@Param("searchName") String searchName);

    @Modifying
    @Transactional
    @Query("UPDATE PressMachine pm SET pm.status = 'inActive' WHERE pm.id = :id")
    void setStatusInactive(@Param("id") Long id);
}
