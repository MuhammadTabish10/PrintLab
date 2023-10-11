package com.PrintLab.service;

import com.PrintLab.dto.PaperStockDto;

import java.util.List;

public interface PaperStockService {
    PaperStockDto save(PaperStockDto paperStockDto);
    List<PaperStockDto> getAll();
    PaperStockDto findById(Long id);
    List<PaperStockDto> searchByName(String name);
    String deleteById(Long id);
    PaperStockDto updatedPaperStock(Long id, PaperStockDto paperStockDto);
    void deleteBrandById(Long id, Long psId);
}
