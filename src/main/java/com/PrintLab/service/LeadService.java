package com.PrintLab.service;

import com.PrintLab.dto.LeadDto;

import java.util.List;

public interface LeadService {
    LeadDto save(LeadDto leadDto);

    List<LeadDto> findAll();

    LeadDto findById(Long id);

//    List<LeadDto> searchByContactName(String companyName,String contactName);

    void deleteById(Long id);

    LeadDto updateLead(Long id, LeadDto leadDto);

//    LeadDto updateCreateLead(Long id, LeadDto leadDto);

    List<LeadDto> searchByContactNameAndCompanyName(String contactName, String companyName);
}
