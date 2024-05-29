package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MasterCustomerStatementDto {

    private Long id;
    private LocalDate localDate;
    private LocalTime localTime;
    private String description;
    private OrderDto order;
    private Double debit;
    private Double credit;
    private Double amount;
    private OrderPaymentHistoryDto paymentHistory;
}
