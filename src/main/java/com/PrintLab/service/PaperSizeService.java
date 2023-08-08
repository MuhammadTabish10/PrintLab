package com.PrintLab.service;

import com.PrintLab.dto.PaperSizeDto;
import com.PrintLab.modal.PaperSize;
import com.PrintLab.modal.UpingPaperSize;

import java.util.List;

public interface PaperSizeService
{
    PaperSizeDto save(PaperSizeDto paperSizeDto);
    List<PaperSizeDto> getAll();
    PaperSizeDto findById(Long id) throws Exception;
    String deleteById(Long id);
    PaperSizeDto updatePaperSize(Long id, PaperSizeDto paperSizeDto);
    UpingPaperSize addUpingPaperSize(Long paperSizeId, UpingPaperSize upingPaperSize);
    void deleteUpingPaperSizeById(Long id, Long upingPaperSizeId);
}
