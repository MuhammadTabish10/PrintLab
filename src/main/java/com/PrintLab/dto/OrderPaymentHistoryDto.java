package com.PrintLab.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderPaymentHistoryDto {

    private Long id;
    private LocalDateTime timeStamp;
    private Double amount;
    private String detail;
    private List<BusinessDto> business;
    private List<BusinessBranchDto> businessBranch;
    private List<UserDto> user;
    private String description;
    private String type;
    private Boolean status;
    private OrderPaymentHistoryDto paymentHistory;
    private OrderDto order;
}
