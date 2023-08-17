package com.PrintLab.service;

import com.PrintLab.dto.ProductProcessDto;
import com.PrintLab.dto.VendorDto;
import com.PrintLab.modal.Vendor;

import java.util.List;

public interface VendorService
{
    VendorDto save(VendorDto vendorDto);
    List<VendorDto> getAll();
    List<VendorDto> getVendorByProcessId(Long productProcessId);
    VendorDto findById(Long id);
    VendorDto findByName(String name);
    String deleteById(Long id);
    VendorDto updateVendor(Long id, VendorDto vendorDto);
    void deleteVendorProcessById(Long id, Long vendorProcessId);
}