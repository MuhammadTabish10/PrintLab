package com.PrintLab.service;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.modal.PaperMarketRates;

import java.util.List;

public interface PaperMarketRatesService
{
    PaperMarketRatesDto save(PaperMarketRatesDto paperMarketRatesDto);
    List<PaperMarketRatesDto> getAll();
    List<PaperMarketRatesDto> findByPaperStock(String paperStock);
    PaperMarketRatesDto findById(Long id);
    String deleteById(Long id);
    PaperMarketRatesDto updatePaperMarketRates(Long id, PaperMarketRates paperMarketRates);
}
