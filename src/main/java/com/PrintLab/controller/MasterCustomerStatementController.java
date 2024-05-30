package com.PrintLab.controller;

import com.PrintLab.dto.MasterCustomerStatementDto;
import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.service.MasterCustomerStatementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MasterCustomerStatementController {

    private final MasterCustomerStatementService masterCustomerStatementService;

    public MasterCustomerStatementController(MasterCustomerStatementService masterCustomerStatementService) {
        this.masterCustomerStatementService = masterCustomerStatementService;
    }

    @PostMapping("/masterCustomerStatement")
    public ResponseEntity<MasterCustomerStatementDto> createMasterCustomer(@RequestBody MasterCustomerStatementDto customerStatementDto) {
        return ResponseEntity.ok(masterCustomerStatementService.save(customerStatementDto));
    }

    @GetMapping("/masterCustomerStatement")
    public ResponseEntity<List<MasterCustomerStatementDto>> getAllMasterCustomerStatement() {
        List<MasterCustomerStatementDto> customerStatementList = masterCustomerStatementService.getAll();
        return ResponseEntity.ok(customerStatementList);
    }

    @GetMapping("/masterCustomerStatement/{id}")
    public ResponseEntity<MasterCustomerStatementDto> getMasterCustomerStatementById(@PathVariable Long id) {
        MasterCustomerStatementDto customerStatementDto = masterCustomerStatementService.findById(id);
        return ResponseEntity.ok(customerStatementDto);
    }

    @DeleteMapping("/masterCustomerStatement/{id}")
    public void deleteOrderPaymentHistoryById(@PathVariable Long id) {
        masterCustomerStatementService.deleteById(id);
        ResponseEntity.ok();
    }

    @PutMapping("/masterCustomerStatement/{id}")
    public ResponseEntity<MasterCustomerStatementDto> updateMasterCustomerStatementDtoById(@PathVariable Long id, @RequestBody MasterCustomerStatementDto masterCustomerStatementDto) {
        MasterCustomerStatementDto updatedCustomerSatement = masterCustomerStatementService.updateById(id, masterCustomerStatementDto);
        return ResponseEntity.ok(updatedCustomerSatement);
    }

    @PostMapping("/get-paginated-master-customer-statements")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaginationResponse> findAll(
            @RequestParam(value = "page-number", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "page-size", defaultValue = "10", required = false) Integer pageSize,
            @RequestBody MasterCustomerStatementDto masterCustomerStatementDto
    ) {
        PaginationResponse paginationResponse = masterCustomerStatementService.getAllPaginatedStatements(pageNumber, pageSize, masterCustomerStatementDto);
        return ResponseEntity.ok(paginationResponse);
    }
}
