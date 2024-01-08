package com.PrintLab.service;

import com.PrintLab.dto.VendorDto;

import java.util.List;

public interface VendorService
{
    VendorDto save(VendorDto vendorDto);
    List<VendorDto> getAll();
    List<VendorDto> getVendorByProcessId(Long productProcessId);
    VendorDto findById(Long id);
    VendorDto findByName(String name);
    List<VendorDto> searchByName(String name);
    String deleteById(Long id);
    VendorDto updateVendor(Long id, VendorDto vendorDto);
    void deleteVendorProcessById(Long id, Long vendorProcessId);

    List<VendorDto> getVendorByProcess(String process);
}