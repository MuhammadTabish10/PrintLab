package com.PrintLab.controller;

import com.PrintLab.dto.InvoiceDto;
import com.PrintLab.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @PostMapping("/save-invoice")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<InvoiceDto> saveInvoice(@RequestBody InvoiceDto invoiceDto){
        InvoiceDto savedInvoice = invoiceService.save(invoiceDto);
        return ResponseEntity.ok(savedInvoice);
    }

    @GetMapping("/get-invoice")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<InvoiceDto>> findAll(){
        List<InvoiceDto> invoiceDtoList = invoiceService.findAll();
        return ResponseEntity.ok(invoiceDtoList);
    }
    @GetMapping("/get-invoice-by-id/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<InvoiceDto> getInvoiceById(@PathVariable Long id) {
        InvoiceDto invoiceDto = invoiceService.findById(id);
        return ResponseEntity.ok(invoiceDto);
    }

    @GetMapping("/invoice/{invoiceNo}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<InvoiceDto>> getAllInvoiceByInvoiceNo(@PathVariable Long invoiceNo) {
        List<InvoiceDto> invoiceDtoList = invoiceService.searchByInvoiceNo(invoiceNo);
        return ResponseEntity.ok(invoiceDtoList);
    }

    @DeleteMapping("/invoice/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/invoice/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<InvoiceDto> updateInvoice(@PathVariable Long id, @RequestBody InvoiceDto invoiceDto) {
        InvoiceDto updatedInvoice = invoiceService.updateInvoice(id, invoiceDto);
        return ResponseEntity.ok(updatedInvoice);
    }
}
