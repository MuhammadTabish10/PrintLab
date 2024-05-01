package com.PrintLab.dto;

import com.PrintLab.model.Customer;
import com.PrintLab.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDto 
{
    private Long id;
    private String product;
    private String paper;
    private String category;
    private String size;
    private Double gsm;
    private Double quantity;
    private Double price;
    private Long jobColorsFront;
    private String sideOptionValue;
    private Boolean impositionValue;
    private Long jobColorsBack;
    private Boolean providedDesign;
    private String url;
    private Long productRule;
    private String status;
    private Boolean ctpProcess;
    private Boolean pressMachineProcess;
    private Boolean paperMarketProcess;
    private User designer;
    private User production;
    private User plateSetter;
    private Boolean isRejected;
    private LocalDateTime timeStamp;
    private User assignedBy;
    private Customer customer;
}
