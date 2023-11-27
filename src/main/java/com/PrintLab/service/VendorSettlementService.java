package com.PrintLab.service;

import com.PrintLab.dto.VendorSettlementDto;

import java.util.List;

public interface VendorSettlementService {
    VendorSettlementDto save(VendorSettlementDto vendorSettlementDto);
    List<VendorSettlementDto> getAll();
    VendorSettlementDto findById(Long id);
    void deleteById(Long id);
    VendorSettlementDto update(Long id, VendorSettlementDto vendorSettlementDto);
}
