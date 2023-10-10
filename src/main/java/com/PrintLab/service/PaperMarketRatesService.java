package com.PrintLab.service;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.model.PaperMarketRates;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface PaperMarketRatesService
{
    PaperMarketRatesDto save(PaperMarketRatesDto paperMarketRatesDto);
    List<PaperMarketRatesDto> getAll();
    Set<String> findDistinctPaperStocks();
    Set<String> findDistinctVendorsByPaperStock(String paperStock);
    Set<String> findDistinctBrandsByPaperStockAndVendor(String paperStock, Long vendorId);
    Set<String> findMadeInByPaperStockAndVendorAndBrand(String paperStock, Long vendorId, String brand);
    Set<String> findDimensionByPaperStockAndVendorAndBrandAndMadeIn(String paperStock, Long vendorId, String brand, String madeIn);
    Set<String> findGsmByPaperStockAndVendorAndBrandAndMadeInAndDimension(String paperStock, Long vendorId, String brand, String madeIn, String dimension);
    List<PaperMarketRatesDto> findAllPaperMarketRatesByPaperStock(String paperStock);
    List<Integer> getDistinctGSMForPaperStock(String paperStock);
    PaperMarketRatesDto findByPaperStock(String paperStock);
    List<PaperMarketRatesDto> searchByPaperStock(String paperStock);
    PaperMarketRatesDto findById(Long id);
    String deleteById(Long id);
    PaperMarketRatesDto updatePaperMarketRates(Long id, PaperMarketRatesDto paperMarketRatesDto);
}
