package com.PrintLab.service.impl;

import com.PrintLab.dto.VendorContactsDto;
import com.PrintLab.model.VendorContacts;
import com.PrintLab.repository.VendorContactsRepository;
import com.PrintLab.service.VendorContactsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendorContactsServiceImpl implements VendorContactsService {

    @Autowired
    VendorContactsRepository vendorContactsRepository;

    @Override
    public VendorContacts save(VendorContactsDto vendorContactsDto) {

        VendorContacts existingVendorContacts = vendorContactsRepository.findByNameAndStatus(vendorContactsDto.getName(), true);
        if (existingVendorContacts != null) {
            return existingVendorContacts;
        }

        VendorContacts newVendorContacts = new VendorContacts();
        newVendorContacts.setName(vendorContactsDto.getName());
        newVendorContacts.setDesignation(vendorContactsDto.getDesignation());
        newVendorContacts.setWhatsapp(vendorContactsDto.getWhatsapp());
        newVendorContacts.setPhone(vendorContactsDto.getPhone());

        return vendorContactsRepository.save(newVendorContacts);
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
            vendorContacts.setIsActive(vendorContactsDto.getIsActive());
            vendorContacts.setIsVerified(vendorContactsDto.getIsVerified());
            return vendorContactsRepository.save(vendorContacts);
        } else {
            return null;
        }
    }

    @Override
    public void delete(Long id) {
        vendorContactsRepository.deleteById(id);
    }

    public VendorContacts toEntity(VendorContactsDto vendorContactsDto){
        return VendorContacts.builder()
                .id(vendorContactsDto.getId())
                .phone(vendorContactsDto.getPhone())
                .designation(vendorContactsDto.getDesignation())
                .isActive(vendorContactsDto.getIsActive())
                .isVerified(vendorContactsDto.getIsVerified())
                .whatsapp(vendorContactsDto.getWhatsapp())
                .name(vendorContactsDto.getName())
                .status(vendorContactsDto.getStatus())
                .user(vendorContactsDto.getUser())
                .build();
    }

    public VendorContactsDto toDto(VendorContacts vendorContacts){
        return VendorContactsDto.builder()
                .id(vendorContacts.getId())
                .phone(vendorContacts.getPhone())
                .designation(vendorContacts.getDesignation())
                .isActive(vendorContacts.getIsActive())
                .isVerified(vendorContacts.getIsVerified())
                .whatsapp(vendorContacts.getWhatsapp())
                .name(vendorContacts.getName())
                .status(vendorContacts.getStatus())
                .user(vendorContacts.getUser())
                .build();
    }
}
