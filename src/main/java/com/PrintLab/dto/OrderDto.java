package com.PrintLab.dto;

import com.PrintLab.model.Customer;
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
    private String paper;
    private String size;
    private String sheetSizeValue;
    private Double gsm;
    private Double quantity;
    private Double price;
    private Long jobColorsFront;
    private String sideOptionValue;
    private Boolean impositionValue;
    private Long jobColorsBack;
    private Boolean providedDesign;
    private String url;
    private Customer customer;
}
