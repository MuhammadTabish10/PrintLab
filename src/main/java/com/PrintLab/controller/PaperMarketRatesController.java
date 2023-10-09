package com.PrintLab.controller;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.dto.PaperMarketRequestBody;
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
    private static final String PAPER_STOCK = "paper";
    private static final String VENDOR = "vendor";
    private static final String BRAND = "brand";
    private static final String MADE_IN = "madein";

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

    @GetMapping("/paper-stock")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperMarketRatesDto>> getPaperRatesByStock(@RequestParam String paperStock) {
        List<PaperMarketRatesDto> paperMarketRatesDtoList = marketRatesService.findAllPaperMarketRatesByPaperStock(paperStock);
        return ResponseEntity.ok(paperMarketRatesDtoList);
    }

    @GetMapping("/product-rule")
    public ResponseEntity<?> getPaperMarketRates(@RequestParam String action, @RequestBody PaperMarketRequestBody requestBody) {
        switch (action) {
            case PAPER_STOCK:
                return ResponseEntity.ok(marketRatesService.findDistinctPaperStocks());
            case VENDOR:
                return ResponseEntity.ok(marketRatesService.findDistinctVendorsByPaperStock(requestBody.getPaperStock()));
            case BRAND:
                return ResponseEntity.ok(marketRatesService.findDistinctBrandsByPaperStockAndVendor(requestBody.getPaperStock(), requestBody.getVendorId()));
            case MADE_IN:
                return ResponseEntity.ok(marketRatesService.findMadeInByPaperStockAndVendorAndBrand(requestBody.getPaperStock(), requestBody.getVendorId(), requestBody.getBrand()));
            default:
                return ResponseEntity.badRequest().body("Invalid action parameter. Supported actions: paper, vendor, brand, madein");
        }
    }

//    http://localhost:8080/api/paper-market-rates/product-rule?action=paper
//    http://localhost:8080/api/paper-market-rates/product-rule?action=vendor&paperStock=Art_Card
//    http://localhost:8080/api/paper-market-rates/product-rule?action=brand&paperStock=Art_Card&vendorId=3
}
