package com.PrintLab.service;

import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.model.PaperMarketRates;
import com.PrintLab.model.Vendor;

import java.util.List;
import java.util.Set;

public interface PaperMarketRatesService
{
    PaperMarketRatesDto save(PaperMarketRatesDto paperMarketRatesDto);
    PaginationResponse getAllPaginatedPaperMarketRates(Integer pageNumber, Integer pageSize);
    List<PaperMarketRatesDto> getAll();
    PaginationResponse getPaperMarketRatesBySearchCriteria(Integer pageNumber, Integer pageSize, PaperMarketRatesDto searchCriteria);
    Set<String> findDistinctPaperStocks();
    Set<Vendor> findDistinctVendorsByPaperStock(String paperStock);
    Set<String> findDistinctBrandsByPaperStockAndVendor(String paperStock, Vendor vendor);
    Set<String> findMadeInByPaperStockAndVendorAndBrand(String paperStock, Vendor vendor, String brand);
    Set<String> findDimensionByPaperStockAndVendorAndBrandAndMadeIn(String paperStock, Vendor vendor, String brand, String madeIn);
    Set<String> findGsmByPaperStockAndVendorAndBrandAndMadeInAndDimension(String paperStock, Vendor vendor, String brand, String madeIn, String dimension);
    List<PaperMarketRatesDto> findPaperMarketRateByEveryColumn(String paperStock, Long vendorId, String brand, String madeIn, String dimension, List<Integer> gsm);
    List<PaperMarketRatesDto> findAllPaperMarketRatesByPaperStock(String paperStock);
    List<Integer> getDistinctGSMForPaperStock(String paperStock);
    PaperMarketRatesDto findByPaperStock(String paperStock);
    List<PaperMarketRatesDto> searchByPaperStock(String paperStock);
    PaperMarketRatesDto findById(Long id);
    String deleteById(Long id);
    PaperMarketRatesDto updatePaperMarketRates(Long id, PaperMarketRatesDto paperMarketRatesDto);
}
