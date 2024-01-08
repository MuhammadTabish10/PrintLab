package com.PrintLab.service;

import com.PrintLab.dto.UV_VendorDto;
import com.PrintLab.model.UV_Vendor;

import java.util.List;

public interface UV_VendorService {
    UV_VendorDto save(UV_VendorDto uvVendorDto);

    List<UV_VendorDto> findAll();

    UV_VendorDto findById(Long id);

    List<UV_VendorDto> searchByName(String name);

    void deleteById(Long id);

    UV_VendorDto updateVendor(Long id, UV_Vendor uvVendor);
}
