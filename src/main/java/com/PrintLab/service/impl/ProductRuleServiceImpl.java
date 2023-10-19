package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductRuleDto;
import com.PrintLab.dto.ProductRulePaperStockDto;
import com.PrintLab.dto.SettingDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.ProductRule;
import com.PrintLab.model.ProductRulePaperStock;
import com.PrintLab.repository.*;
import com.PrintLab.service.ProductRuleService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductRuleServiceImpl implements ProductRuleService {
    private static final String DOUBLE_SIDED = "DOUBLE_SIDED";
    private static final String SINGLE_SIDED = "SINGLE_SIDED";

    private final ProductRuleRepository productRuleRepository;
    private final VendorRepository vendorRepository;
    private final PressMachineRepository pressMachineRepository;
    private final ProductRulePaperStockRepository productRulePaperStockRepository;
    private final CtpRepository ctpRepository;

    public ProductRuleServiceImpl(ProductRuleRepository productRuleRepository, VendorRepository vendorRepository, PressMachineRepository pressMachineRepository, ProductRulePaperStockRepository productRulePaperStockRepository, CtpRepository ctpRepository) {
        this.productRuleRepository = productRuleRepository;
        this.vendorRepository = vendorRepository;
        this.pressMachineRepository = pressMachineRepository;
        this.productRulePaperStockRepository = productRulePaperStockRepository;
        this.ctpRepository = ctpRepository;
    }

    @Override
    public ProductRuleDto save(ProductRuleDto productRuleDto) {
        ProductRule productRule = toEntity(productRuleDto);
        if(productRule.getPrintSide().equals(SINGLE_SIDED)){
            productRule.setImpositionValue(false);
        }
        ProductRule createdProductRule = productRuleRepository.save(productRule);

        List<ProductRulePaperStock> productRulePaperStockList = productRule.getProductRulePaperStockList();
        if (productRulePaperStockList != null && !productRulePaperStockList.isEmpty()) {
            for (ProductRulePaperStock productRulePaperStock : productRulePaperStockList) {
                productRulePaperStock.setProductRule(createdProductRule);
                productRulePaperStock.setVendor(vendorRepository.findById(productRulePaperStock.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found for id => %d", productRulePaperStock.getProductRule().getId()))));
                productRulePaperStock.setPaperStock(productRulePaperStock.getPaperStock());
                productRulePaperStock.setBrand(productRulePaperStock.getBrand());
                productRulePaperStock.setMadeIn(productRulePaperStock.getMadeIn());
                productRulePaperStock.setDimension(productRulePaperStock.getDimension());
                productRulePaperStock.setGsm(productRulePaperStock.getGsm());
                productRulePaperStock.setStatus(true);
                productRulePaperStockRepository.save(productRulePaperStock);
            }
            createdProductRule.setProductRulePaperStockList(productRulePaperStockList);
            productRuleRepository.save(createdProductRule);
        }

        return toDto(createdProductRule);
    }

    @Override
    public List<ProductRuleDto> getAllProductRule() {
        List<ProductRule> productRuleList = productRuleRepository.findAll();
        List<ProductRuleDto> productRuleDtoList = new ArrayList<>();

        for (ProductRule productRule : productRuleList) {
            ProductRuleDto productRuleDto = toDto(productRule);
            productRuleDtoList.add(productRuleDto);
        }
        return productRuleDtoList;
    }

    @Override
    public List<ProductRuleDto> searchByTitle(String title) {
        List<ProductRule> productRuleList = productRuleRepository.findProductRuleByTitle(title);
        List<ProductRuleDto> productRuleDtoList = new ArrayList<>();

        for (ProductRule productRule : productRuleList) {
            ProductRuleDto productRuleDto = toDto(productRule);
            productRuleDtoList.add(productRuleDto);
        }
        return productRuleDtoList;
    }

    @Override
    public ProductRuleDto getProductRuleById(Long id) {
        Optional<ProductRule> optionalProductRule = productRuleRepository.findById(id);

        if (optionalProductRule.isPresent()) {
            ProductRule productRule = optionalProductRule.get();
            return toDto(productRule);
        } else {
            throw new RecordNotFoundException(String.format("ProductRule not found for id => %d", id));
        }
    }

    @Override
    public ProductRuleDto update(Long id, ProductRuleDto productRuleDto) {
        ProductRule productRule = toEntity(productRuleDto);
        Optional<ProductRule> optionalProductRule = productRuleRepository.findById(id);
        int count = 0;
        if (optionalProductRule.isPresent()) {
            ProductRule existingProductRule = optionalProductRule.get();
            existingProductRule.setTitle(productRule.getTitle());
            existingProductRule.setPrintSide(productRule.getPrintSide());
            existingProductRule.setJobColorFront(productRule.getJobColorFront());
            existingProductRule.setJobColorBack(productRule.getJobColorBack());
            existingProductRule.setSize(productRule.getSize());
            existingProductRule.setQuantity(productRule.getQuantity());
            if(existingProductRule.getPrintSide().equals(DOUBLE_SIDED)){
                existingProductRule.setImpositionValue(productRule.getImpositionValue());
            }
            else{
                existingProductRule.setImpositionValue(false);
            }
            existingProductRule.setPressMachine(pressMachineRepository.findById(productRuleDto.getPressMachine().getId())
                    .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")));
            existingProductRule.setPressMachine(pressMachineRepository.findById(productRuleDto.getPressMachine().getId())
                    .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")));
            existingProductRule.setCtp(ctpRepository.findById(productRuleDto.getCtp().getId())
                    .orElseThrow(() -> new RecordNotFoundException("Ctp not found")));

            List<ProductRulePaperStock> existingPrpsValues = existingProductRule.getProductRulePaperStockList();
            List<ProductRulePaperStock> newPrpsValues = productRule.getProductRulePaperStockList();
            List<ProductRulePaperStock> newValuesToAdd = new ArrayList<>();

            for (ProductRulePaperStock newValue : newPrpsValues) {
                Optional<ProductRulePaperStock> existingValue = existingPrpsValues.stream()
                        .filter(prValue -> prValue.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    ProductRulePaperStock existingPrpsValue = existingValue.get();

                    existingPrpsValue.setPaperStock(newValue.getPaperStock());
                    existingPrpsValue.setBrand(newValue.getBrand());
                    existingPrpsValue.setMadeIn(newValue.getMadeIn());
                    existingPrpsValue.setDimension(newValue.getDimension());
                    existingPrpsValue.setGsm(newValue.getGsm());
                    existingPrpsValue.setStatus(newValue.getStatus());

                    existingPrpsValue.setVendor(vendorRepository.findById(newValue.getVendor().getId())
                            .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found for id => %d", newValue.getProductRule().getId()))));

                } else {
                    newValue.setProductRule(existingProductRule);
                    newValuesToAdd.add(newValue);
                    count++;
                }
            }
            if(count > 0){
                existingPrpsValues.addAll(newValuesToAdd);
            }

            ProductRule updatedProductRule = productRuleRepository.save(existingProductRule);
            return toDto(updatedProductRule);
        } else {
            throw new RecordNotFoundException(String.format("Product Rule not found for id => %d", id));
        }
    }

    @Override
    public void deleteById(Long id) {
        Optional<ProductRule> optionalProductRule = productRuleRepository.findById(id);

        if (optionalProductRule.isPresent()) {
            ProductRule productRule = optionalProductRule.get();
            productRuleRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException(String.format("ProductRule not found for id => %d", id));
        }
    }


    public ProductRuleDto toDto(ProductRule productRule) {
        List<ProductRulePaperStockDto> productRulePaperStockDtoList = productRule.getProductRulePaperStockList().stream()
                .map(prps -> {
                    ProductRulePaperStockDto productRulePaperStockDto = new ProductRulePaperStockDto();
                    productRulePaperStockDto.setId(prps.getId());
                    productRulePaperStockDto.setPaperStock(prps.getPaperStock());
                    productRulePaperStockDto.setBrand(prps.getBrand());
                    productRulePaperStockDto.setMadeIn(prps.getMadeIn());
                    productRulePaperStockDto.setDimension(prps.getDimension());
                    productRulePaperStockDto.setGsm(prps.getGsm());
                    productRulePaperStockDto.setStatus(prps.getStatus());
                    productRulePaperStockDto.setVendor(vendorRepository.findById(prps.getVendor().getId())
                            .orElseThrow(() -> new RecordNotFoundException("Vendor not found")));
                    return productRulePaperStockDto;
                }).collect(Collectors.toList());

        return ProductRuleDto.builder()
                .id(productRule.getId())
                .title(productRule.getTitle())
                .printSide(productRule.getPrintSide())
                .jobColorBack(productRule.getJobColorBack())
                .jobColorFront(productRule.getJobColorFront())
                .size(productRule.getSize())
                .quantity(productRule.getQuantity())
                .impositionValue(productRule.getImpositionValue())
                .pressMachine(pressMachineRepository.findById(productRule.getPressMachine().getId())
                        .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")))
                .ctp(ctpRepository.findById(productRule.getCtp().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Ctp not found")))
                .productRulePaperStockList(productRulePaperStockDtoList)
                .build();
    }

    public ProductRule toEntity(ProductRuleDto productRuleDto) {
        List<ProductRulePaperStock> productRulePaperStocks =  productRuleDto.getProductRulePaperStockList().stream()
                .map(prps -> {
                    ProductRulePaperStock productRulePaperStock = new ProductRulePaperStock();
                    productRulePaperStock.setId(prps.getId());
                    productRulePaperStock.setPaperStock(prps.getPaperStock());
                    productRulePaperStock.setBrand(prps.getBrand());
                    productRulePaperStock.setMadeIn(prps.getMadeIn());
                    productRulePaperStock.setDimension(prps.getDimension());
                    productRulePaperStock.setGsm(prps.getGsm());
                    productRulePaperStock.setStatus(prps.getStatus());
                    productRulePaperStock.setVendor(vendorRepository.findById(prps.getVendor().getId())
                            .orElseThrow(() -> new RecordNotFoundException("Vendor not found")));
                    return productRulePaperStock;
                }).collect(Collectors.toList());



        return ProductRule.builder()
                .id(productRuleDto.getId())
                .title(productRuleDto.getTitle())
                .printSide(productRuleDto.getPrintSide())
                .jobColorBack(productRuleDto.getJobColorBack())
                .jobColorFront(productRuleDto.getJobColorFront())
                .size(productRuleDto.getSize())
                .quantity(productRuleDto.getQuantity())
                .impositionValue(productRuleDto.getImpositionValue())
                .pressMachine(pressMachineRepository.findById(productRuleDto.getPressMachine().getId())
                        .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")))
                .ctp(ctpRepository.findById(productRuleDto.getCtp().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Ctp not found")))
                .productRulePaperStockList(productRulePaperStocks)
                .build();
    }
}
