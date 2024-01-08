package com.PrintLab.repository;

import com.PrintLab.model.UV_Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface UV_VendorRepository extends JpaRepository<UV_Vendor,Long> {

    List<UV_Vendor> findByStatus(boolean status);

    List<UV_Vendor> findVendorByNameLike(String name);
}
