package com.PrintLab.service;

import com.PrintLab.dto.VendorContactsDto;
import com.PrintLab.model.VendorContacts;

import java.util.List;
import java.util.Optional;

public interface VendorContactsService {

    VendorContactsDto save(VendorContactsDto vendorContactsDto);
    List<VendorContacts> findAll();
    Optional<VendorContacts> findById(Long id);
    List<VendorContacts> findByName(String name);
    VendorContacts update(Long id, VendorContactsDto vendorContactsDto);
    void delete(Long id);

    List<VendorContacts> findByVendorId(Long vendorId);
}
