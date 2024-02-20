package com.PrintLab.service;

import com.PrintLab.dto.InvoiceDto;

import java.util.List;

public interface InvoiceService {
    InvoiceDto save(InvoiceDto invoiceDto);

    List<InvoiceDto> findAll();

    InvoiceDto findById(Long id);

    List<InvoiceDto> searchByInvoiceNo(Long invoiceNo);

    void deleteById(Long id);

    InvoiceDto updateInvoice(Long id, InvoiceDto invoiceDto);

    byte[] downloadInvoicePdf(String fileName, Long id);
}
