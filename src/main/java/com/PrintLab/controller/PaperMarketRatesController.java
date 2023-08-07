package com.PrintLab.controller;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.modal.PaperMarketRates;
import com.PrintLab.service.PaperMarketRatesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paperMarketRates")
public class PaperMarketRatesController
{
    private final PaperMarketRatesService marketRatesService;

    public PaperMarketRatesController(PaperMarketRatesService marketRatesService) {
        this.marketRatesService = marketRatesService;
    }

    @PostMapping
    public ResponseEntity<PaperMarketRatesDto> createPaperMarketRates(@RequestBody PaperMarketRatesDto paperMarketRatesDto) {
        try {
            return ResponseEntity.ok(marketRatesService.save(paperMarketRatesDto));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<PaperMarketRatesDto>> getAllPaperMarketRates() {
        List<PaperMarketRatesDto> paperMarketRatesDtoList = marketRatesService.getAll();
        return ResponseEntity.ok(paperMarketRatesDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaperMarketRatesDto> getPaperMarketRatesById(@PathVariable Long id) {
        try {
            PaperMarketRatesDto paperMarketRatesDto = marketRatesService.findById(id);
            return ResponseEntity.ok(paperMarketRatesDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePaperMarketRates(@PathVariable Long id) {
        marketRatesService.deleteById(id);
        return ResponseEntity.ok("Paper Market Rates with ID " + id + " has been deleted.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaperMarketRatesDto> updatePaperMarketRates(@PathVariable Long id, @RequestBody PaperMarketRates paperMarketRates) {
        try {
            PaperMarketRatesDto updatedPmrDto = marketRatesService.updatePaperMarketRates(id, paperMarketRates);
            return ResponseEntity.ok(updatedPmrDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
