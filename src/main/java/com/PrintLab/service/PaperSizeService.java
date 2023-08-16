package com.PrintLab.service;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.dto.PaperSizeDto;

import java.util.List;

public interface PaperSizeService
{
    PaperSizeDto save(PaperSizeDto paperSizeDto);
    List<PaperSizeDto> getAll();
    PaperSizeDto findById(Long id) throws Exception;
    List<PaperSizeDto> findByLabel(String label);
    String deleteById(Long id);
    PaperSizeDto updatePaperSize(Long id, PaperSizeDto paperSizeDto);
}
