package com.PrintLab.controller;

import com.PrintLab.dto.LeadDto;
import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.service.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LeadController {

    @Autowired
    LeadService leadService;

    @PostMapping("/save-lead")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<LeadDto> saveLead(@RequestBody LeadDto leadDto) {
        LeadDto savedLead = leadService.save(leadDto);
        return ResponseEntity.ok(savedLead);
    }

//    @GetMapping("/get-leads")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<List<LeadDto>> findAll() {
//        List<LeadDto> leadDtoList = leadService.findAll();
//        return ResponseEntity.ok(leadDtoList);
//    }

    @PostMapping("/get-leads")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaginationResponse> findAll(
            @RequestParam(value = "page-number", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "page-size", defaultValue = "10", required = false) Integer pageSize,
            @RequestBody LeadDto leadDto
    ) {
        PaginationResponse paginationResponse = leadService.getAllPaginatedLeads(pageNumber, pageSize,leadDto);
        return ResponseEntity.ok(paginationResponse);
    }

    @GetMapping("/get-lead-by-id/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<LeadDto> getLeadById(@PathVariable Long id) {
        LeadDto leadDto = leadService.findById(id);
        return ResponseEntity.ok(leadDto);
    }

    @GetMapping("/leads-by-like-search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<LeadDto>> getAllLeadByLikeSearch(
            @RequestParam(required = false) String contactName,
            @RequestParam(required = false) String companyName
    ) {
        List<LeadDto> leadDtoList = leadService.searchByContactNameAndCompanyName(contactName, companyName);
        return ResponseEntity.ok(leadDtoList);
    }

    @GetMapping("/leads-by-companyName")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<LeadDto>> getAllLeadByCompanyName(
            @RequestParam(required = false) String companyName
    ) {
        List<LeadDto> leadDtoList = leadService.searchByCompanyName(companyName);
        return ResponseEntity.ok(leadDtoList);
    }

    @DeleteMapping("/lead/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteInvoice(@PathVariable Long id) {
        leadService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/lead/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<LeadDto> updateLead(@PathVariable Long id, @RequestBody LeadDto leadDto) {
        LeadDto updatedLead = leadService.updateLead(id, leadDto);
        return ResponseEntity.ok(updatedLead);
    }

//    @PutMapping("/update-lead/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<LeadDto> updateCreateLead(@PathVariable Long id, @RequestBody LeadDto leadDto) {
//        LeadDto updatedLead = leadService.updateCreateLead(id, leadDto);
//        return ResponseEntity.ok(updatedLead);
//    }

    @GetMapping("/leads/distinct-values")
    public ResponseEntity<Map<String,String>> getAllDistinctValues() {
        return ResponseEntity.ok(leadService.findAllDistinctValues());
    }
}
