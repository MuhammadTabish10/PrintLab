package com.PrintLab.dto;

import com.PrintLab.modal.UpingPaperSize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaperSizeDto
{
    private Long id;
    private String label;
    private String status;
}
