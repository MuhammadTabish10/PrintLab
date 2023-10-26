package com.PrintLab.controller;

import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.dto.PaperMarketRatesSpecDto;
import com.PrintLab.dto.PaperMarketRequestBody;
import com.PrintLab.model.PaperMarketRates;
import com.PrintLab.service.PaperMarketRatesService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PaperMarketRatesController
{
    private static final String PAPER_STOCK = "paper";
    private static final String VENDOR = "vendor";
    private static final String BRAND = "brand";
    private static final String MADE_IN = "madein";
    private static final String DIMENSION = "dimension";
    private static final String GSM = "gsm";

    private final PaperMarketRatesService marketRatesService;
    public PaperMarketRatesController(PaperMarketRatesService marketRatesService) {
        this.marketRatesService = marketRatesService;
    }

    @PostMapping("/paper-market-rates")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperMarketRatesDto> createPaperMarketRates(@RequestBody PaperMarketRatesDto paperMarketRatesDto) {
        return ResponseEntity.ok(marketRatesService.save(paperMarketRatesDto));
    }

    @GetMapping("/paper-market-rates/page")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaginationResponse> getAllPaperMarketRates(
            @RequestParam(value = "page-number", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "page-size", defaultValue = "15", required = false) Integer pageSize
    ) {
        PaginationResponse paginationResponse = marketRatesService.getAllPaginatedPaperMarketRates(pageNumber, pageSize);
        return ResponseEntity.ok(paginationResponse);
    }

    @GetMapping("/paper-market-rates")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperMarketRatesDto>> getAllPaperMarketRates() {
        List<PaperMarketRatesDto> paperMarketRatesDtoList = marketRatesService.getAll();
        return ResponseEntity.ok(paperMarketRatesDtoList);
    }


    @GetMapping("/paper-market-rates/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperMarketRatesDto> getPaperMarketRatesById(@PathVariable Long id) {
        PaperMarketRatesDto paperMarketRatesDto = marketRatesService.findById(id);
        return ResponseEntity.ok(paperMarketRatesDto);
    }

    @GetMapping("/paper-market-rates/paper-stock/{stock}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperMarketRatesDto> getPaperMarketRatesByPaperStock(@PathVariable String stock) {
        PaperMarketRatesDto paperMarketRatesDto = marketRatesService.findByPaperStock(stock);

        return ResponseEntity.ok(paperMarketRatesDto);
    }

    @GetMapping("/paper-market-rates/paper-stock/gsm")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Integer>> getPaperStockAllGsm(@RequestParam(name = "paperStock") String paperStock) {
        List<Integer> gsmList = marketRatesService.getDistinctGSMForPaperStock(paperStock);
        return ResponseEntity.ok(gsmList);
    }

    @GetMapping("/paper-market-rates/paper-stocks/{stock}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperMarketRatesDto>> getAllPaperMarketRateByPaperStock(@PathVariable String stock) {
        List<PaperMarketRatesDto> paperMarketRatesDtoList = marketRatesService.searchByPaperStock(stock);
        return ResponseEntity.ok(paperMarketRatesDtoList);
    }

    @DeleteMapping("/paper-market-rates/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deletePaperMarketRates(@PathVariable Long id) {
        marketRatesService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/paper-market-rates/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperMarketRatesDto> updatePaperMarketRates(@PathVariable Long id, @RequestBody PaperMarketRatesDto paperMarketRatesDto) {
        PaperMarketRatesDto updatedPmrDto = marketRatesService.updatePaperMarketRates(id, paperMarketRatesDto);
        return ResponseEntity.ok(updatedPmrDto);
    }

    @GetMapping("/paper-market-rates/paper-stock")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperMarketRatesDto>> getPaperRatesByStock(@RequestParam String paperStock) {
        List<PaperMarketRatesDto> paperMarketRatesDtoList = marketRatesService.findAllPaperMarketRatesByPaperStock(paperStock);
        return ResponseEntity.ok(paperMarketRatesDtoList);
    }

    @PostMapping("/paper-market-rates/product-rule")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getPaperMarketRates(@RequestParam String action, @RequestBody PaperMarketRequestBody requestBody) {
        switch (action) {
            case PAPER_STOCK:
                return ResponseEntity.ok(marketRatesService.findDistinctPaperStocks());
            case VENDOR:
                return ResponseEntity.ok(marketRatesService.findDistinctVendorsByPaperStock(requestBody.getPaperStock()));
            case BRAND:
                return ResponseEntity.ok(marketRatesService.findDistinctBrandsByPaperStockAndVendor(requestBody.getPaperStock(), requestBody.getVendor()));
            case MADE_IN:
                return ResponseEntity.ok(marketRatesService.findMadeInByPaperStockAndVendorAndBrand(requestBody.getPaperStock(), requestBody.getVendor(), requestBody.getBrand()));
            case DIMENSION:
                return ResponseEntity.ok(marketRatesService.findDimensionByPaperStockAndVendorAndBrandAndMadeIn(requestBody.getPaperStock(), requestBody.getVendor(), requestBody.getBrand(), requestBody.getMadeIn()));
            case GSM:
                return ResponseEntity.ok(marketRatesService.findGsmByPaperStockAndVendorAndBrandAndMadeInAndDimension(requestBody.getPaperStock(), requestBody.getVendor(), requestBody.getBrand(), requestBody.getMadeIn(), requestBody.getDimension()));
            default:
                return ResponseEntity.badRequest().body("Invalid action parameter. Supported actions: paper, vendor, brand, madein, dimension, gsm");
        }
    }
//    http://localhost:8080/api/paper-market-rates/product-rule?action=paper

    @PostMapping("/paper-market-rates/product-rule/result")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperMarketRatesDto>> findPaperMarketRatesFromGivenCriteria(@Valid @RequestBody PaperMarketRatesSpecDto paperMarketRatesSpecDto) {
        List<PaperMarketRatesDto> paperMarketRatesDto =
                marketRatesService.findPaperMarketRateByEveryColumn(paperMarketRatesSpecDto.getPaperStock(),
                        paperMarketRatesSpecDto.getVendorId(), paperMarketRatesSpecDto.getBrand(),
                        paperMarketRatesSpecDto.getMadeIn(), paperMarketRatesSpecDto.getDimension(),
                        paperMarketRatesSpecDto.getGsm());
        return ResponseEntity.ok(paperMarketRatesDto);
    }

    @PostMapping("/paper-market-rates/search")
    public ResponseEntity<PaginationResponse> search(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "15", required = false) Integer pageSize,
            @RequestBody PaperMarketRatesDto paperMarketRatesDto)
    {
        PaginationResponse paginationResponse = marketRatesService.getPaperMarketRatesBySearchCriteria(pageNumber, pageSize, paperMarketRatesDto);
        return ResponseEntity.ok(paginationResponse);
    }

    @GetMapping("/paper-market-rates/distinct-values")
    public ResponseEntity<Map<String,String>> getAllDistinctValues() {
        return ResponseEntity.ok(marketRatesService.findAllDistinctValues());
    }
}
