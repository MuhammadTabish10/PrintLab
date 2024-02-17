package com.PrintLab.service;

import com.PrintLab.dto.LeadDto;
import com.PrintLab.dto.PaginationResponse;

import java.util.List;
import java.util.Map;

public interface LeadService {
    List<LeadDto> searchByContactNameAndCompanyName(String contactName, String companyName);
    PaginationResponse getAllPaginatedLeads(Integer pageNumber, Integer pageSize,LeadDto leadDto);
    List<LeadDto> searchByCompanyName(String companyName);
    LeadDto updateLead(Long id, LeadDto leadDto);
    Map<String, String> findAllDistinctValues();
    LeadDto save(LeadDto leadDto);
    LeadDto findById(Long id);
    void deleteById(Long id);

}
