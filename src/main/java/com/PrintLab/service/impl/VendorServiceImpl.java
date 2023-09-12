package com.PrintLab.service.impl;

import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.dto.VendorDto;
import com.PrintLab.dto.VendorProcessDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.*;
import com.PrintLab.repository.ProductProcessRepository;
import com.PrintLab.repository.VendorProcessRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.VendorService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;
    private final VendorProcessRepository vendorProcessRepository;
    private final ProductProcessRepository productProcessRepository;
    private final ProductProcessServiceImpl productProcessService;

    public VendorServiceImpl(VendorRepository vendorRepository, VendorProcessRepository vendorProcessRepository, ProductProcessRepository productProcessRepository, ProductProcessServiceImpl productProcessService) {
        this.vendorRepository = vendorRepository;
        this.vendorProcessRepository = vendorProcessRepository;
        this.productProcessRepository = productProcessRepository;
        this.productProcessService = productProcessService;
    }


    @Transactional
    @Override
    public VendorDto save(VendorDto vendorDto) {
        Vendor vendor = toEntity(vendorDto);
        Vendor createdVendor = vendorRepository.save(vendor);

        List<VendorProcess> vendorProcessList = vendor.getVendorProcessList();
        if(vendorProcessList != null && !vendorProcessList.isEmpty()){
            for (VendorProcess vendorProcess : vendorProcessList) {
                vendorProcess.setVendor(createdVendor);
                vendorProcess.setProductProcess(productProcessRepository.findById(vendorProcess.getProductProcess().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Product Process not found for id => %d", vendorProcess.getProductProcess().getId()))));
                vendorProcessRepository.save(vendorProcess);
            }
            createdVendor.setVendorProcessList(vendorProcessList);
            vendorRepository.save(createdVendor);
        }

        return toDto(createdVendor);
    }

    @Override
    public List<VendorDto> getAll() {
        List<Vendor> vendorList = vendorRepository.findAll();
        List<VendorDto> vendorDtoList = new ArrayList<>();

        for (Vendor vendor : vendorList) {
            VendorDto vendorDto = toDto(vendor);
            vendorDtoList.add(vendorDto);
        }
        return vendorDtoList;
    }

    @Override
    public List<VendorDto> getVendorByProcessId(Long productProcessId) {
        Optional<List<Vendor>> optionalVendorList = Optional.ofNullable(vendorRepository.findByVendorProcessList_ProductProcess_Id(productProcessId));

        if (optionalVendorList.isPresent()) {
            List<Vendor> vendorList = optionalVendorList.get();
            Set<Vendor> uniqueVendors = new HashSet<>();
            List<VendorDto> vendorDtoList = new ArrayList<>();

            for (Vendor vendor : vendorList) {
                if (uniqueVendors.add(vendor)) { // Add vendor to set, returns false if vendor is already in set
                    VendorDto vendorDto = toDto(vendor);
                    vendorDtoList.add(vendorDto);
                }
            }
            return vendorDtoList;
        } else {
            throw new RecordNotFoundException(String.format("Vendor not found on Product process id => %d", productProcessId));
        }
    }


    @Override
    public VendorDto findById(Long id){
        Optional<Vendor> optionalVendor = vendorRepository.findById(id);

        if(optionalVendor.isPresent()) {
            Vendor vendor = optionalVendor.get();
            return toDto(vendor);
        }
        else {
            throw new RecordNotFoundException(String.format("Vendor not found for id => %d", id));
        }
    }

    @Override
    public VendorDto findByName(String name) {
        Optional<Vendor> vendorOptional = Optional.ofNullable(vendorRepository.findByName(name));

        if(vendorOptional.isPresent()){
            Vendor vendor = vendorOptional.get();
            return toDto(vendor);
        }
        else {
            throw new RecordNotFoundException(String.format("Vendor not found at => %s", name));
        }
    }

    @Override
    public List<VendorDto> searchByName(String name) {
        List<Vendor> vendorList = vendorRepository.findVendorsByName(name);
        List<VendorDto> vendorDtoList = new ArrayList<>();

        for (Vendor vendor : vendorList) {
            VendorDto vendorDto = toDto(vendor);
            vendorDtoList.add(vendorDto);
        }
        return vendorDtoList;
    }

    @Override
    public String deleteById(Long id) {
        Optional<Vendor> optionalVendor = vendorRepository.findById(id);

        if(optionalVendor.isPresent()) {
            Vendor vendor = optionalVendor.get();
            vendorRepository.deleteById(id);
        }
        else{
            throw new RecordNotFoundException(String.format("Vendor not found for id => %d", id));
        }
        return null;
    }

    @Override
    public VendorDto updateVendor(Long id, VendorDto vendorDto) {
        Vendor vendor = toEntity(vendorDto);
        Optional<Vendor> optionalVendor = vendorRepository.findById(id);
        int count = 0;

        if (optionalVendor.isPresent()) {
            Vendor existingVendor = optionalVendor.get();
            existingVendor.setName(vendor.getName());
            existingVendor.setContactName(vendor.getContactName());
            existingVendor.setContactNumber(vendor.getContactNumber());
            existingVendor.setEmail(vendor.getEmail());
            existingVendor.setAddress(vendor.getAddress());
            existingVendor.setNotes(vendor.getNotes());

            List<VendorProcess> existingVpValues = existingVendor.getVendorProcessList();
            List<VendorProcess> newVpValues = vendor.getVendorProcessList();
            List<VendorProcess> newValuesToAdd = new ArrayList<>();

            for (VendorProcess newValue : newVpValues) {
                Optional<VendorProcess> existingValue = existingVpValues.stream()
                        .filter(value -> value.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    VendorProcess existingVpValue = existingValue.get();
                    existingVpValue.setRateSqft(newValue.getRateSqft());
                    existingVpValue.setMaterialType(newValue.getMaterialType());
                    existingVpValue.setNotes(newValue.getNotes());
                    existingVpValue.setProductProcess(productProcessRepository.findById(newValue.getProductProcess().getId())
                            .orElseThrow(() -> new RecordNotFoundException(String.format("Product Process not found for id => %d", newValue.getProductProcess().getId()))));
                } else {
                    newValue.setVendor(existingVendor);
                    newValuesToAdd.add(newValue);
                    count++;
                }
            }

            if (count > 0) {
                existingVpValues.addAll(newValuesToAdd);
            }

            Vendor updatedVendor = vendorRepository.save(existingVendor);
            return toDto(updatedVendor);

        } else {
            throw new RecordNotFoundException(String.format("Vendor not found for id => %d", id));
        }
    }

    @Override
    public void deleteVendorProcessById(Long id, Long vendorProcessId) {
        Optional<Vendor> optionalVendor = vendorRepository.findById(id);
        if (optionalVendor.isPresent()) {
            Vendor vendor = optionalVendor.get();

            Optional<VendorProcess> optionalVendorProcess = vendor.getVendorProcessList()
                    .stream()
                    .filter(vp -> vp.getId().equals(vendorProcessId))
                    .findFirst();

            if (optionalVendorProcess.isPresent()) {
                VendorProcess vendorProcessToDelete = optionalVendorProcess.get();
                vendor.getVendorProcessList().remove(vendorProcessToDelete);
                vendorProcessRepository.delete(vendorProcessToDelete);
                vendorRepository.save(vendor);
            } else{
                throw new RecordNotFoundException("Vendor Process not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Vendor not found for id => %d", id));
        }
    }

    public VendorDto toDto(Vendor vendor) {
        List<VendorProcessDto> vendorProcessDto = new ArrayList<>();
        for (VendorProcess vendorProcess : vendor.getVendorProcessList()) {
            VendorProcessDto dto = VendorProcessDto.builder()
                    .id(vendorProcess.getId())
                    .materialType(vendorProcess.getMaterialType())
                    .rateSqft(vendorProcess.getRateSqft())
                    .notes(vendorProcess.getNotes())
                    .productProcess(productProcessService.toDto(productProcessRepository.findById(vendorProcess.getProductProcess().getId())
                            .orElseThrow(()-> new RecordNotFoundException("Product Process Not Found"))))
                    .build();
            vendorProcessDto.add(dto);
        }

        return VendorDto.builder()
                .id(vendor.getId())
                .name(vendor.getName())
                .email(vendor.getEmail())
                .date(vendor.getDate())
                .contactName(vendor.getContactName())
                .contactNumber(vendor.getContactNumber())
                .address(vendor.getAddress())
                .notes(vendor.getNotes())
                .vendorProcessList(vendorProcessDto)
                .build();
    }


    public Vendor toEntity(VendorDto vendorDto) {
        Vendor vendor = Vendor.builder()
                .id(vendorDto.getId())
                .name(vendorDto.getName())
                .email(vendorDto.getEmail())
                .date(vendorDto.getDate())
                .contactName(vendorDto.getContactName())
                .contactNumber(vendorDto.getContactNumber())
                .address(vendorDto.getAddress())
                .notes(vendorDto.getNotes())
                .build();

        List<VendorProcess> vendorProcessList = new ArrayList<>();
        for (VendorProcessDto dto : vendorDto.getVendorProcessList()) {
            ProductProcess productProcess = ProductProcess.builder()
                    .id(dto.getProductProcess().getId())
                    .build();

            VendorProcess vendorProcess = VendorProcess.builder()
                    .id(dto.getId())
                    .vendor(vendor)
                    .productProcess(productProcess)
                    .materialType(dto.getMaterialType())
                    .rateSqft(dto.getRateSqft())
                    .notes(dto.getNotes())
                    .build();

            vendorProcessList.add(vendorProcess);
        }

        vendor.setVendorProcessList(vendorProcessList);
        return vendor;
    }
}
