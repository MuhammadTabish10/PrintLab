package com.PrintLab.service;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.modal.PaperMarketRates;

import java.util.List;

public interface PaperMarketRatesService
{
    PaperMarketRatesDto save(PaperMarketRatesDto paperMarketRatesDto);
    List<PaperMarketRatesDto> getAll();
    PaperMarketRatesDto findById(Long id) throws Exception;
    String deleteById(Long id);
    PaperMarketRatesDto updatePaperMarketRates(Long id, PaperMarketRates paperMarketRates);
}
