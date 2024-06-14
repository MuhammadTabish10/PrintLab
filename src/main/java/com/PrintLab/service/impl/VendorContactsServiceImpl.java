package com.PrintLab.service.impl;

import com.PrintLab.dto.VendorContactsDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Vendor;
import com.PrintLab.model.VendorContacts;
import com.PrintLab.repository.VendorContactsRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.VendorContactsService;
import com.PrintLab.utils.HelperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendorContactsServiceImpl implements VendorContactsService {

    @Autowired
    VendorContactsRepository vendorContactsRepository;
    @Autowired
    VendorRepository vendorRepository;
    @Autowired
    HelperUtils helperUtils;

    @Override
    public VendorContactsDto save(VendorContactsDto vendorContactsDto) {
        VendorContacts vendorContacts = toEntity(vendorContactsDto);
        vendorContacts.setIsLock(false);
        vendorContacts.setIsVerified(false);
        vendorContacts.setStatus(false);
        vendorContacts.setAddedBy(helperUtils.getCurrentUser());


        Vendor vendor = vendorRepository.findById(vendorContacts.getVendor().getId())
                .orElseThrow(() -> new RecordNotFoundException("Vendor not found at id: " + vendorContacts.getVendor().getId()));

        vendorContacts.setVendor(vendor);
        return toDto(vendorContactsRepository.save(vendorContacts));
    }

    @Override
    public List<VendorContacts> findAll() {
        return vendorContactsRepository.findAll();
    }

    @Override
    public Optional<VendorContacts> findById(Long id) {
        return vendorContactsRepository.findById(id);
    }

    @Override
    public List<VendorContacts> findByName(String name) {
        return vendorContactsRepository.findByName(name);
    }

    @Override
    public VendorContacts update(Long id, VendorContactsDto vendorContactsDto) {
        Optional<VendorContacts> vendorContactsOptional = vendorContactsRepository.findById(id);
        if (vendorContactsOptional.isPresent()) {
            VendorContacts vendorContacts = vendorContactsOptional.get();

            vendorContacts.setStatus(vendorContactsDto.getStatus());
            vendorContacts.setIsVerified(vendorContactsDto.getIsVerified());
            vendorContacts.setIsLock(vendorContactsDto.getIsLock());
            return vendorContactsRepository.save(vendorContacts);
        } else {
            return null;
        }
    }

    @Override
    public void delete(Long id) {
        vendorContactsRepository.deleteById(id);
    }

    @Override
    public List<VendorContacts> findByVendorId(Long vendorId) {
        return vendorContactsRepository.findByVendorId(vendorId);
    }

    public VendorContacts toEntity(VendorContactsDto vendorContactsDto){
        return VendorContacts.builder()
                .id(vendorContactsDto.getId())
                .phone(vendorContactsDto.getPhone())
                .designation(vendorContactsDto.getDesignation())
                .isVerified(vendorContactsDto.getIsVerified())
                .whatsapp(vendorContactsDto.getWhatsapp())
                .name(vendorContactsDto.getName())
                .status(vendorContactsDto.getStatus())
                .addedBy(vendorContactsDto.getAddedBy())
                .isLock(vendorContactsDto.getIsLock())
                .addedBy(vendorContactsDto.getAddedBy())
                .vendor(vendorContactsDto.getVendor())
                .build();
    }

    public VendorContactsDto toDto(VendorContacts vendorContacts){
        return VendorContactsDto.builder()
                .id(vendorContacts.getId())
                .phone(vendorContacts.getPhone())
                .designation(vendorContacts.getDesignation())
                .isVerified(vendorContacts.getIsVerified())
                .whatsapp(vendorContacts.getWhatsapp())
                .name(vendorContacts.getName())
                .status(vendorContacts.getStatus())
                .addedBy(vendorContacts.getAddedBy())
                .isLock(vendorContacts.getIsLock())
                .addedBy(vendorContacts.getAddedBy())
                .vendor(vendorContacts.getVendor())
                .build();
    }
}
