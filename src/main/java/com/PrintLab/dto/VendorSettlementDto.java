package com.PrintLab.dto;

import com.PrintLab.model.Order;
import com.PrintLab.model.Vendor;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VendorSettlementDto {
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateAndTime;

    private Double debit;
    private Double credit;
    private Vendor vendor;
    private Order order;
    private Boolean status;
}
