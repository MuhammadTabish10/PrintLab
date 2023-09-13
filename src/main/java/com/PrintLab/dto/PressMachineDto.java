package com.PrintLab.dto;

import com.PrintLab.modal.Vendor;
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
    private String plateDimension;
    private String gripperMargin;
    private String maxSheetSize;
    private String minSheetSize;
    private Integer maxSPH;
    private Double ctp_rate;
    private Double impression_1000_rate;
    private Boolean is_selected;
    private String status;
    private Vendor vendor;
    private List<PressMachineSizeDto> pressMachineSize;
}
