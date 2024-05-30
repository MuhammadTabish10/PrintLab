package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MasterCustomerStatementDto {

    private Long id;
    private LocalDate date;
    private LocalTime time;
    private String description;
    private Double debit;
    private Double credit;
    private Double balance;
    private List<LocalDateTime> dateList;
    private OrderPaymentHistoryDto paymentHistory;
    private OrderDto order;
}
