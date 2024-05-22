package com.PrintLab.Mapper;

import com.PrintLab.dto.BusinessUnitProcessDto;
import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.dto.ProductRuleDto;
import com.PrintLab.dto.ProductRulePaperStockDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.ProductRule;
import com.PrintLab.model.ProductRulePaperStock;
import com.PrintLab.repository.CtpRepository;
import com.PrintLab.repository.PressMachineRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductRuleMapper {
    private final BusinessUnitProcessMapper businessUnitProcessMapper;
    private final JobProcessedDetailsMapper detailMapper;

    private final PressMachineRepository pressMachineRepository;

    private final CtpRepository ctpRepository;

    public ProductRuleMapper(BusinessUnitProcessMapper businessUnitProcessMapper, JobProcessedDetailsMapper detailMapper, PressMachineRepository pressMachineRepository, CtpRepository ctpRepository) {
        this.businessUnitProcessMapper = businessUnitProcessMapper;
        this.detailMapper = detailMapper;
        this.pressMachineRepository = pressMachineRepository;
        this.ctpRepository = ctpRepository;
    }

    public ProductRuleDto toDto(ProductRule productRule) {
        List<ProductRulePaperStockDto> productRulePaperStockDtoList = productRule.getProductRulePaperStockList().stream()
                .map(prps -> {
                    ProductRulePaperStockDto productRulePaperStockDto = new ProductRulePaperStockDto();
                    productRulePaperStockDto.setId(prps.getId());
                    productRulePaperStockDto.setPaperStock(prps.getPaperStock());
                    productRulePaperStockDto.setCustomerFriendlyName(prps.getCustomerFriendlyName());
                    productRulePaperStockDto.setBrand(prps.getBrand());
                    productRulePaperStockDto.setMadeIn(prps.getMadeIn());
                    productRulePaperStockDto.setDimension(prps.getDimension());
                    productRulePaperStockDto.setGsm(prps.getGsm());
                    productRulePaperStockDto.setStatus(prps.getStatus());
                    productRulePaperStockDto.setVendor(prps.getVendor());
                    return productRulePaperStockDto;
                }).collect(Collectors.toList());

        List<BusinessUnitProcessDto> processListDto = null;
        if (productRule.getProcessList() != null) {
            processListDto = productRule.getProcessList().stream()
                    .map(businessUnitProcessMapper::toProcessDto)
                    .collect(Collectors.toList());
        }

        List<JobProcessedDetailsDto> processedDetailListDto = null;
        if (productRule.getProcessedDetailList() != null) {
            processedDetailListDto = productRule.getProcessedDetailList().stream()
                    .map(detailMapper::toDto)
                    .collect(Collectors.toList());
        }

        return ProductRuleDto.builder()
                .id(productRule.getId())
                .productName(productRule.getProductName())
                .printSide(productRule.getPrintSide())
                .jobColorBack(productRule.getJobColorBack())
                .jobColorFront(productRule.getJobColorFront())
                .sizeCategory(productRule.getSizeCategory())
                .businessCategory(productRule.getBusinessCategory())
                .size(productRule.getSize())
                .quantity(productRule.getQuantity())
                .impositionValue(productRule.getImpositionValue())
                .status(productRule.getStatus())
                .pressMachine(pressMachineRepository.findById(productRule.getPressMachine().getId())
                        .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")))
                .ctp(ctpRepository.findById(productRule.getCtp().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Ctp not found")))
                .processList(processListDto)
                .processedDetailList(processedDetailListDto)
                .productRulePaperStockList(productRulePaperStockDtoList)
                .type(productRule.getType())
                .build();
    }

    public ProductRule toEntity(ProductRuleDto productRuleDto) {
        List<ProductRulePaperStockDto> productRulePaperStockList = productRuleDto.getProductRulePaperStockList();

        if (productRulePaperStockList != null && !productRulePaperStockList.isEmpty()) {
            return toEntityWithPaperStock(productRuleDto);
        } else {
            return toEntityWithoutPaperStock(productRuleDto);
        }
    }

    private ProductRule toEntityWithPaperStock(ProductRuleDto productRuleDto) {
        List<ProductRulePaperStock> productRulePaperStocks = productRuleDto.getProductRulePaperStockList().stream()
                .map(prps -> {
                    ProductRulePaperStock productRulePaperStock = new ProductRulePaperStock();
                    productRulePaperStock.setId(prps.getId());
                    productRulePaperStock.setPaperStock(prps.getPaperStock());
                    productRulePaperStock.setCustomerFriendlyName(prps.getCustomerFriendlyName());
                    productRulePaperStock.setBrand(prps.getBrand());
                    productRulePaperStock.setMadeIn(prps.getMadeIn());
                    productRulePaperStock.setDimension(prps.getDimension());
                    productRulePaperStock.setGsm(prps.getGsm());
                    productRulePaperStock.setStatus(prps.getStatus());
                    productRulePaperStock.setVendor(prps.getVendor());
                    return productRulePaperStock;
                }).collect(Collectors.toList());

        return ProductRule.builder()
                .id(productRuleDto.getId())
                .productName(productRuleDto.getProductName())
                .printSide(productRuleDto.getPrintSide())
                .jobColorBack(productRuleDto.getJobColorBack())
                .jobColorFront(productRuleDto.getJobColorFront())
                .sizeCategory(productRuleDto.getSizeCategory())
                .size(productRuleDto.getSize())
                .quantity(productRuleDto.getQuantity())
                .impositionValue(productRuleDto.getImpositionValue())
                .status(productRuleDto.getStatus())
                .pressMachine(pressMachineRepository.findById(productRuleDto.getPressMachine().getId())
                        .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")))
                .ctp(ctpRepository.findById(productRuleDto.getCtp().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Ctp not found")))
                .productRulePaperStockList(productRulePaperStocks)
                .type(productRuleDto.getType())
                .build();
    }

    private ProductRule toEntityWithoutPaperStock(ProductRuleDto productRuleDto) {
        return ProductRule.builder()
                .id(productRuleDto.getId())
                .productName(productRuleDto.getProductName())
                .businessCategory(productRuleDto.getBusinessCategory())
                .sizeCategory(productRuleDto.getSizeCategory())
                .size(productRuleDto.getSize())
                .processList(productRuleDto.getProcessList().stream()
                        .map(businessUnitProcessMapper::toProcessEntity)
                        .collect(Collectors.toList()))
                .processedDetailList(productRuleDto.getProcessedDetailList().stream()
                        .map(detailMapper::toEntity)
                        .collect(Collectors.toList()))
                .type(productRuleDto.getType())
                .build();
    }

}
