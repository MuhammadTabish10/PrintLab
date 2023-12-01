package com.PrintLab.dto;

import com.PrintLab.model.Order;
import com.PrintLab.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderTransactionDto {
    private Long id;
    private String plateDimension;
    private String vendor;
    private Integer quantity;
    private Double unitPrice;
    private Double amount;
    private String paymentMode;
    private User user;
    private Order order;
    private Boolean status;
}
