package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InvoiceDto {
    private Long id;
    private Long invoiceNo;
    private Long customer;
    private String customerEmail;
    private String business;
    private Boolean sendLater;
    private String billingAddress;
    private String terms;
    private Double balanceDue;
    private Date invoiceDate;
    private Date dueDate;
    private List<InvoiceProductDto> invoiceProductDtoList;
    private String message;
    private String statement;
    private Boolean status;

}
