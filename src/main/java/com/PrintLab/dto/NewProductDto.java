package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.xml.soap.Text;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class NewProductDto {
    private Long id;
    private String paperStock;
    private String size;
    private String quantity;
    private String printSide;
    private String jobColorFront;
    private String jobColorBack;
    private Boolean imposition;
    private Boolean isPaperStockPublic;
    private Boolean isSizePublic;
    private Boolean isQuantityPublic;
    private Boolean isPrintSidePublic;
    private Boolean isJobColorFrontPublic;
    private Boolean isJobColorBackPublic;
    private List<ProductGsmDto> productGsm = new ArrayList<>();
}
