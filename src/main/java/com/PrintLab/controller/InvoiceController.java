package com.PrintLab.controller;

import com.PrintLab.dto.InvoiceDto;
import com.PrintLab.service.InvoiceService;
import com.PrintLab.service.PdfGenerationService;
import com.PrintLab.utils.EmailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;
    @Autowired
    EmailUtils emailUtils;
    @Autowired
    private PdfGenerationService pdfGenerationService;

    @PostMapping("/save-invoice")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<InvoiceDto> saveInvoice(@RequestBody InvoiceDto invoiceDto) {
        InvoiceDto savedInvoice = invoiceService.save(invoiceDto);
        return ResponseEntity.ok(savedInvoice);
    }

    @GetMapping("/get-invoice")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<InvoiceDto>> findAll() {
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

    @GetMapping("/invoice/pdf/{fileName}/{invoiceId}")
    public ResponseEntity<byte[]> getInvoicePdf(
            @PathVariable("fileName") String fileName,
            @PathVariable("invoiceId") Long invoiceId,
            @RequestParam("email") String email
    ) {
        try {
            byte[] pdf = invoiceService.downloadInvoicePdf(fileName, invoiceId);

            boolean emailSent = emailUtils.sendEmailWithAttachment(
                    email, "Invoice PDF", "Please find attached the invoice PDF.", pdf, fileName + ".pdf");

            if (emailSent) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", fileName + ".pdf");

                return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }


}
