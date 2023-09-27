package com.PrintLab.repository;

import com.PrintLab.model.PressMachineSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface PressMachineSizeRepository extends JpaRepository<PressMachineSize,Long> {
    Optional<PressMachineSize> findByPressMachineIdAndPaperSizeIdAndValue(Long id, Long paperSizeId, Integer Value);
}
