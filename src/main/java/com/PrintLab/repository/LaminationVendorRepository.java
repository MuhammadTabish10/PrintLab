package com.PrintLab.repository;

import com.PrintLab.model.LaminationVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LaminationVendorRepository extends JpaRepository<LaminationVendor,Long> {

    List<LaminationVendor> findByStatus(boolean status);

    List<LaminationVendor> findVendorByNameLikeAndStatusIsTrue(String name);
}
