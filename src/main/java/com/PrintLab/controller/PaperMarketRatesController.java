package com.PrintLab.controller;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.modal.PaperMarketRates;
import com.PrintLab.service.PaperMarketRatesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paper-market-rates")
public class PaperMarketRatesController
{
    private final PaperMarketRatesService marketRatesService;
    public PaperMarketRatesController(PaperMarketRatesService marketRatesService) {
        this.marketRatesService = marketRatesService;
    }

    @PostMapping
    public ResponseEntity<PaperMarketRatesDto> createPaperMarketRates(@RequestBody PaperMarketRatesDto paperMarketRatesDto) {
        return ResponseEntity.ok(marketRatesService.save(paperMarketRatesDto));
    }

    @GetMapping
    public ResponseEntity<List<PaperMarketRatesDto>> getAllPaperMarketRates() {
        List<PaperMarketRatesDto> paperMarketRatesDtoList = marketRatesService.getAll();
        return ResponseEntity.ok(paperMarketRatesDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaperMarketRatesDto> getPaperMarketRatesById(@PathVariable Long id) {
        PaperMarketRatesDto paperMarketRatesDto = marketRatesService.findById(id);
        return ResponseEntity.ok(paperMarketRatesDto);
    }

    @GetMapping("/paper-stock/{stock}")
    public ResponseEntity<List<PaperMarketRatesDto>> getPaperMarketRatesByPaperStock(@PathVariable String stock) {
        List<PaperMarketRatesDto> paperMarketRatesDto = marketRatesService.findByPaperStock(stock);
        return ResponseEntity.ok(paperMarketRatesDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePaperMarketRates(@PathVariable Long id) {
        marketRatesService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaperMarketRatesDto> updatePaperMarketRates(@PathVariable Long id, @RequestBody PaperMarketRates paperMarketRates) {
        PaperMarketRatesDto updatedPmrDto = marketRatesService.updatePaperMarketRates(id, paperMarketRates);
        return ResponseEntity.ok(updatedPmrDto);
    }
}
