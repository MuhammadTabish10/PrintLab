package com.PrintLab.service;

import com.PrintLab.dto.ProductProcessDto;
import com.PrintLab.dto.UpingDto;
import com.PrintLab.dto.VendorDto;
import com.PrintLab.modal.PressMachineSize;
import com.PrintLab.modal.Uping;
import com.PrintLab.modal.UpingPaperSize;

import java.util.List;

public interface UpingService
{
    UpingDto save(UpingDto upingDto);
    List<UpingDto> getAll();
    UpingDto findById(Long id);
    List<UpingDto> findByProductSize(String productSize);
    List<UpingDto> getUpingByPaperSizeId(Long paperSizeId);
    String deleteById(Long id);
    UpingDto updateUping(Long id, UpingDto upingDto);
    void deleteUpingPaperSizeById(Long id, Long upingPaperSizeId);
}
