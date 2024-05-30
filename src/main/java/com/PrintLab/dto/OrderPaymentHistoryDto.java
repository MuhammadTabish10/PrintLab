package com.PrintLab.dto;

import com.PrintLab.model.MasterCustomerStatement;
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
    private String type;
    private List<BusinessDto> business;
    private List<BusinessBranchDto> businessBranch;
    private List<UserDto> paymentReceivedBy;
    private String description;
    private Boolean status;
    private OrderDto order;
    private MasterCustomerStatement masterCustomerStatement;
}
