package com.PrintLab.dto;

import com.PrintLab.modal.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDto 
{
    private Long id;
    private String product;
    private String size;
    private Double gsm;
    private Double quantity;
    private Double price;
    private Boolean providedDesign;
    private String url;
    private Customer customer;
}
