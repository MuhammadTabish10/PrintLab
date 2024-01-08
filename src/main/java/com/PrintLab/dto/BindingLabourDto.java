package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BindingLabourDto {
    private Long id;
    private LocalDateTime timeStamp;
    private String name;
    private String createdBy;
    private String type;
    private String category;
    private String size;
    private Double rate;
    private boolean status;
}
