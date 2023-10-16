package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductRuleDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.ProductRule;
import com.PrintLab.repository.CtpRepository;
import com.PrintLab.repository.PressMachineRepository;
import com.PrintLab.repository.ProductRuleRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.ProductRuleService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductRuleServiceImpl implements ProductRuleService {

    private final ProductRuleRepository productRuleRepository;
    private final VendorRepository vendorRepository;
    private final PressMachineRepository pressMachineRepository;
    private final CtpRepository ctpRepository;

    public ProductRuleServiceImpl(ProductRuleRepository productRuleRepository, VendorRepository vendorRepository, PressMachineRepository pressMachineRepository, CtpRepository ctpRepository) {
        this.productRuleRepository = productRuleRepository;
        this.vendorRepository = vendorRepository;
        this.pressMachineRepository = pressMachineRepository;
        this.ctpRepository = ctpRepository;
    }

    @Override
    public ProductRuleDto save(ProductRuleDto productRuleDto) {
        ProductRule productRule = toEntity(productRuleDto);
        productRule.setStatus(true);
        ProductRule createdProductRule = productRuleRepository.save(productRule);
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
    public List<ProductRuleDto> searchByPaperStock(String paperStock) {
        List<ProductRule> productRuleList = productRuleRepository.findProductRuleByPaperStock(paperStock);
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
        Optional<ProductRule> optionalProductRule = productRuleRepository.findById(id);
        if (optionalProductRule.isPresent()) {
            ProductRule existingProductRule = optionalProductRule.get();
            existingProductRule.setPaperStock(productRuleDto.getPaperStock());
            existingProductRule.setBrand(productRuleDto.getBrand());
            existingProductRule.setMadeIn(productRuleDto.getMadeIn());
            existingProductRule.setDimension(productRuleDto.getDimension());
            existingProductRule.setGsm(productRuleDto.getGsm());
            existingProductRule.setStatus(productRuleDto.getStatus());
            existingProductRule.setVendor(vendorRepository.findById(productRuleDto.getVendor().getId())
                    .orElseThrow(() -> new RecordNotFoundException("Vendor not found")));
            existingProductRule.setPressMachine(pressMachineRepository.findById(productRuleDto.getPressMachine().getId())
                    .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")));
            existingProductRule.setCtp(ctpRepository.findById(productRuleDto.getCtp().getId())
                    .orElseThrow(() -> new RecordNotFoundException("Ctp not found")));

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
        return ProductRuleDto.builder()
                .id(productRule.getId())
                .paperStock(productRule.getPaperStock())
                .brand(productRule.getBrand())
                .madeIn(productRule.getMadeIn())
                .dimension(productRule.getDimension())
                .gsm(productRule.getGsm())
                .vendor(vendorRepository.findById(productRule.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Vendor not found")))
                .pressMachine(pressMachineRepository.findById(productRule.getPressMachine().getId())
                        .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")))
                .ctp(ctpRepository.findById(productRule.getCtp().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Ctp not found")))
                .build();
    }

    public ProductRule toEntity(ProductRuleDto productRuleDto) {
        return ProductRule.builder()
                .id(productRuleDto.getId())
                .paperStock(productRuleDto.getPaperStock())
                .brand(productRuleDto.getBrand())
                .madeIn(productRuleDto.getMadeIn())
                .dimension(productRuleDto.getDimension())
                .gsm(productRuleDto.getGsm())
                .vendor(vendorRepository.findById(productRuleDto.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Vendor not found")))
                .pressMachine(pressMachineRepository.findById(productRuleDto.getPressMachine().getId())
                        .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")))
                .ctp(ctpRepository.findById(productRuleDto.getCtp().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Ctp not found")))
                .build();
    }
}
