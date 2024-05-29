package com.PrintLab.controller;

import com.PrintLab.dto.MasterCustomerStatementDto;
import com.PrintLab.dto.OrderPaymentHistoryDto;
import com.PrintLab.service.MasterCustomerStatementService;
import org.springframework.http.ResponseEntity;
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
}
