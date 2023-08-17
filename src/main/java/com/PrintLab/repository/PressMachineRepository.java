package com.PrintLab.repository;

import com.PrintLab.modal.PressMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PressMachineRepository extends JpaRepository<PressMachine,Long>
{
    List<PressMachine> findByPressMachineSize_PaperSize_Id(Long paperSizeId);
    PressMachine findByName(String name);
}
