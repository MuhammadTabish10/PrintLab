package com.PrintLab.service.impl;

import com.PrintLab.dto.InvoiceDto;
import com.PrintLab.dto.InvoiceProductDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Invoice;
import com.PrintLab.model.InvoiceProduct;
import com.PrintLab.repository.InvoiceProductRepository;
import com.PrintLab.repository.InvoiceRepository;
import com.PrintLab.service.InvoiceService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceProductRepository invoiceProductRepository;

    public InvoiceServiceImpl(InvoiceRepository invoiceRepository, InvoiceProductRepository invoiceProductRepository) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceProductRepository = invoiceProductRepository;
    }


    @Override
    public InvoiceDto save(InvoiceDto invoiceDto) {
        Invoice invoice = toEntity(invoiceDto);
        invoice.setStatus(true);

        Invoice savedInvoice = invoiceRepository.save(invoice);

        List<InvoiceProduct> invoiceProductList = savedInvoice.getInvoiceProduct();

        if (invoiceProductList != null) {
            invoiceProductList.forEach(invoiceProduct -> {
                invoiceProduct.setInvoice(savedInvoice);
                invoiceProduct.setStatus(true);
                invoiceProductRepository.save(invoiceProduct);
            });

            savedInvoice.setInvoiceProduct(invoiceProductList);
            invoiceRepository.save(savedInvoice);
        }

        return toDto(savedInvoice);
    }

    @Override
    public List<InvoiceDto> findAll() {
        List<Invoice> invoiceList = invoiceRepository.findAllByStatusIsTrue();

        return invoiceList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceDto findById(Long id) {
        return invoiceRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RecordNotFoundException(String.format("Invoice not found for id => %d", id)));
    }

    @Override
    public List<InvoiceDto> searchByInvoiceNo(Long invoiceNo) {
        List<Invoice> invoiceList = invoiceRepository.findInvoiceByInvoiceNoAndStatusIsTrue(invoiceNo);

        return invoiceList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new RecordNotFoundException(String.format("Invoice not found for id => %d", id));
        }
        invoiceRepository.setStatusFalse(id);
    }

    @Override
    @Transactional
    public InvoiceDto updateInvoice(Long id, InvoiceDto invoiceDto) {
        Invoice invoice = toEntity(invoiceDto);
        Optional<Invoice> optionalInvoice = invoiceRepository.findById(id);

        if (optionalInvoice.isPresent()) {
            Invoice existingInvoice = optionalInvoice.get();

            existingInvoice.setCustomer(invoice.getCustomer());
            existingInvoice.setCustomerEmail(invoice.getCustomerEmail());
            existingInvoice.setBusiness(invoice.getBusiness());
            existingInvoice.setSendLater(invoice.getSendLater());
            existingInvoice.setBillingAddress(invoice.getBillingAddress());
            existingInvoice.setTerms(invoice.getTerms());
            existingInvoice.setInvoiceDate(invoice.getInvoiceDate());
            existingInvoice.setDueDate(invoice.getDueDate());
            existingInvoice.setBalanceDue(invoice.getBalanceDue());
            existingInvoice.setMessage(invoice.getMessage());
            existingInvoice.setStatement(invoice.getStatement());
            existingInvoice.setInvoiceNo(invoiceDto.getInvoiceNo());

            List<InvoiceProduct> existingProductValues = existingInvoice.getInvoiceProduct();
            List<InvoiceProduct> newProductValues = invoice.getInvoiceProduct();
            List<InvoiceProduct> newValuesToAdd = new ArrayList<>();
            List<InvoiceProduct> valuesToRemove = new ArrayList<>();

            for (InvoiceProduct existingProValue : existingProductValues) {
                if (!newProductValues.contains(existingProValue)) {
                    valuesToRemove.add(existingProValue);
                }
            }


            for (InvoiceProduct valueToRemove : valuesToRemove) {
                invoiceProductRepository.delete(valueToRemove);
            }

            existingProductValues.removeAll(valuesToRemove);

            for (InvoiceProduct newValue : newProductValues) {
                Optional<InvoiceProduct> existingValue = existingProductValues.stream()
                        .filter(prValue -> prValue.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    InvoiceProduct existingPrValue = existingValue.get();
                    existingPrValue.setDateRow(newValue.getDateRow());
                    existingPrValue.setProductRow(newValue.getProductRow());
                    existingPrValue.setType(newValue.getType());
                    existingPrValue.setDescription(newValue.getDescription());
                    existingPrValue.setQty(newValue.getQty());
                    existingPrValue.setRate(newValue.getRate());
                    existingPrValue.setAmount(newValue.getAmount());
                } else {
                    newValue.setInvoice(existingInvoice);
                    newValuesToAdd.add(newValue);
                }
            }

            existingProductValues.addAll(newValuesToAdd);

            Invoice updatedInvoice = invoiceRepository.save(existingInvoice);

            return toDto(updatedInvoice);
        } else {
            throw new RecordNotFoundException(String.format("Invoice not found for id => %d", id));
        }
    }




    public InvoiceDto toDto(Invoice invoice) {
        List<InvoiceProductDto> invoiceProductDtoList = invoice.getInvoiceProduct().stream()
                .map(ipl -> new InvoiceProductDto(
                        ipl.getId(),
                        ipl.getDateRow(),
                        ipl.getProductRow(),
                        ipl.getType(),
                        ipl.getDescription(),
                        ipl.getQty(),
                        ipl.getRate(),
                        ipl.getAmount(),
                        ipl.getStatus()
                ))
                .collect(Collectors.toList());

        return InvoiceDto.builder()
                .id(invoice.getId())
                .customer(invoice.getCustomer())
                .customerEmail(invoice.getCustomerEmail())
                .business(invoice.getBusiness())
                .billingAddress(invoice.getBillingAddress())
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .balanceDue(invoice.getBalanceDue())
                .terms(invoice.getTerms())
                .message(invoice.getMessage())
                .sendLater(invoice.getSendLater())
                .invoiceNo(invoice.getInvoiceNo())
                .statement(invoice.getStatement())
                .status(invoice.getStatus())
                .invoiceProductDtoList(invoiceProductDtoList)
                .build();
    }

    public Invoice toEntity(InvoiceDto invoiceDto) {
        List<InvoiceProduct> invoiceProductList = invoiceDto.getInvoiceProductDtoList().stream()
                .map(this::convertToInvoiceProduct)
                .collect(Collectors.toList());


        return Invoice.builder()
                .id(invoiceDto.getId())
                .customer(invoiceDto.getCustomer())
                .customerEmail(invoiceDto.getCustomerEmail())
                .business(invoiceDto.getBusiness())
                .billingAddress(invoiceDto.getBillingAddress())
                .sendLater(invoiceDto.getSendLater())
                .terms(invoiceDto.getTerms())
                .balanceDue(invoiceDto.getBalanceDue())
                .invoiceDate(invoiceDto.getInvoiceDate())
                .dueDate(invoiceDto.getDueDate())
                .message(invoiceDto.getMessage())
                .statement(invoiceDto.getStatement())
                .invoiceNo(invoiceDto.getInvoiceNo())
                .invoiceProduct(invoiceProductList)
                .build();
    }

    private InvoiceProduct convertToInvoiceProduct(InvoiceProductDto dto) {
        return InvoiceProduct.builder()
                .id(dto.getId())
                .dateRow(dto.getDateRow())
                .productRow(dto.getProductRow())
                .type(dto.getType())
                .description(dto.getDescription())
                .qty(dto.getQty())
                .rate(dto.getRate())
                .amount(dto.getAmount())
                .status(dto.getStatus())
                .build();
    }
}
