package com.PrintLab.repository;

import com.PrintLab.modal.PressMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PressMachineRepository extends JpaRepository<PressMachine,Long>
{
}
