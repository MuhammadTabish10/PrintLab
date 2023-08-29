package com.PrintLab.dto;

import com.PrintLab.modal.ProductDefinition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PressMachineDto
{
    private Long id;
    private String name;
    private Double ctp_rate;
    private Double impression_1000_rate;
    private Boolean is_selected;
    private List<PressMachineSizeDto> pressMachineSize;
}
