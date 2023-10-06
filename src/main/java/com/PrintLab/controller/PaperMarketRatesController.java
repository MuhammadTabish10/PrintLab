package com.PrintLab.controller;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.model.PaperMarketRates;
import com.PrintLab.service.PaperMarketRatesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperMarketRatesDto> createPaperMarketRates(@RequestBody PaperMarketRatesDto paperMarketRatesDto) {
        return ResponseEntity.ok(marketRatesService.save(paperMarketRatesDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperMarketRatesDto>> getAllPaperMarketRates() {
        List<PaperMarketRatesDto> paperMarketRatesDtoList = marketRatesService.getAll();
        return ResponseEntity.ok(paperMarketRatesDtoList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperMarketRatesDto> getPaperMarketRatesById(@PathVariable Long id) {
        PaperMarketRatesDto paperMarketRatesDto = marketRatesService.findById(id);
        return ResponseEntity.ok(paperMarketRatesDto);
    }

    @GetMapping("/paper-stock/{stock}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperMarketRatesDto> getPaperMarketRatesByPaperStock(@PathVariable String stock) {
        PaperMarketRatesDto paperMarketRatesDto = marketRatesService.findByPaperStock(stock);

        return ResponseEntity.ok(paperMarketRatesDto);
    }

    @GetMapping("/paper-stock/gsm")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Integer>> getPaperStockAllGsm(@RequestParam(name = "paperStock") String paperStock) {
        List<Integer> gsmList = marketRatesService.getDistinctGSMForPaperStock(paperStock);
        return ResponseEntity.ok(gsmList);
    }

    @GetMapping("/paper-stocks/{stock}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperMarketRatesDto>> getAllPaperMarketRateByPaperStock(@PathVariable String stock) {
        List<PaperMarketRatesDto> paperMarketRatesDtoList = marketRatesService.searchByPaperStock(stock);
        return ResponseEntity.ok(paperMarketRatesDtoList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deletePaperMarketRates(@PathVariable Long id) {
        marketRatesService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperMarketRatesDto> updatePaperMarketRates(@PathVariable Long id, @RequestBody PaperMarketRatesDto paperMarketRatesDto) {
        PaperMarketRatesDto updatedPmrDto = marketRatesService.updatePaperMarketRates(id, paperMarketRatesDto);
        return ResponseEntity.ok(updatedPmrDto);
    }
}
