package com.PrintLab.repository;

import com.PrintLab.model.VendorContacts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorContactsRepository extends JpaRepository<VendorContacts, Long> {
    VendorContacts findByNameAndStatus(String name, boolean status);

    List<VendorContacts> findByName(String name);

}
