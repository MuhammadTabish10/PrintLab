package com.PrintLab.service;

import com.PrintLab.dto.InventoryDto;
import com.PrintLab.dto.PaperMarketRatesDto;

import java.util.List;

public interface InventoryService {
    InventoryDto save(InventoryDto inventoryDto);
    List<InventoryDto> getAll();
    InventoryDto findById(Long id);
    String deleteById(Long id);
    InventoryDto updateInventory(Long id, InventoryDto inventoryDto);
    PaperMarketRatesDto updatePaperMarketRate(Long inventoryId);
}
