package com.PrintLab.service;

import com.PrintLab.dto.LaminationVendorDto;
import com.PrintLab.model.LaminationVendor;

import java.util.List;

public interface LaminationVendorService {
    LaminationVendorDto save(LaminationVendorDto laminationVendorDto);

    List<LaminationVendorDto> findAll();

    LaminationVendorDto findById(Long id);

    List<LaminationVendorDto> searchByName(String name);

    void deleteById(Long id);

    LaminationVendorDto updateVendor(Long id, LaminationVendor laminationVendor);
}
