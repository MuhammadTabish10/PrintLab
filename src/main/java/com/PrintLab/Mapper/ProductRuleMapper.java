package com.PrintLab.Mapper;

import com.PrintLab.dto.*;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.ProductRule;
import com.PrintLab.model.ProductRulePaperStock;
import com.PrintLab.repository.CtpRepository;
import com.PrintLab.repository.PressMachineRepository;
import com.PrintLab.service.impl.RoleServiceImpl;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductRuleMapper {
    private final BusinessUnitProcessMapper businessUnitProcessMapper;
    private final JobProcessedDetailsMapper detailMapper;

    private final PressMachineRepository pressMachineRepository;

    private final CtpRepository ctpRepository;

    private final RoleServiceImpl roleService;

    public ProductRuleMapper(RoleServiceImpl roleService, BusinessUnitProcessMapper businessUnitProcessMapper, JobProcessedDetailsMapper detailMapper, PressMachineRepository pressMachineRepository, CtpRepository ctpRepository) {
        this.businessUnitProcessMapper = businessUnitProcessMapper;
        this.detailMapper = detailMapper;
        this.pressMachineRepository = pressMachineRepository;
        this.ctpRepository = ctpRepository;
        this.roleService = roleService;
    }

    public ProductRuleDto toDto(ProductRule productRule) {
        List<ProductRulePaperStock> productRulePaperStockList = productRule.getProductRulePaperStockList();

        if (productRulePaperStockList != null && !productRulePaperStockList.isEmpty()) {
            return toDtoWithPaperStock(productRule);
        } else {
            return toDtoWithoutPaperStock(productRule);
        }
    }

    private ProductRuleDto toDtoWithPaperStock(ProductRule productRule) {
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
                .size(productRule.getSize())
                .quantity(productRule.getQuantity())
                .impositionValue(productRule.getImpositionValue())
                .businessCategory(productRule.getBusinessCategory())
                .status(productRule.getStatus())
                .pressMachine(pressMachineRepository.findById(productRule.getPressMachine().getId())
                        .orElseThrow(() -> new RecordNotFoundException("PressMachine not found")))
                .ctp(ctpRepository.findById(productRule.getCtp().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Ctp not found")))
                .productRulePaperStockList(productRulePaperStockDtoList)
                .type(productRule.getType())
                .build();
    }

    private ProductRuleDto toDtoWithoutPaperStock(ProductRule productRule) {
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

        List<RoleDto> roleDtoList = null;
        if (productRule.getVisibleTo() != null) {
            roleDtoList = productRule.getVisibleTo().stream()
                    .map(roleService::toDto)
                    .collect(Collectors.toList());
        }

        return ProductRuleDto.builder()
                .id(productRule.getId())
                .productName(productRule.getProductName())
                .businessCategory(productRule.getBusinessCategory())
                .sizeCategory(productRule.getSizeCategory())
                .size(productRule.getSize())
                .quantity(productRule.getQuantity())
                .status(productRule.getStatus())
                .processList(processListDto)
                .processedDetailList(processedDetailListDto)
                .type(productRule.getType())
                .visibleTo(roleDtoList)
                .groupSheet(productRule.getGroupSheet())
                .predefined(productRule.getPredefined())
                .custom(productRule.getCustom())
                .up(productRule.getUp())
                .groupSheetOf(productRule.getGroupSheetOf())
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
                .businessCategory(productRuleDto.getBusinessCategory())
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
                .status(productRuleDto.getStatus())
                .sizeCategory(productRuleDto.getSizeCategory())
                .size(productRuleDto.getSize())
                .processList(productRuleDto.getProcessList().stream()
                        .map(businessUnitProcessMapper::toProcessEntity)
                        .collect(Collectors.toList()))
                .processedDetailList(productRuleDto.getProcessedDetailList().stream()
                        .map(detailMapper::toEntity)
                        .collect(Collectors.toList()))
                .type(productRuleDto.getType())

                .visibleTo(productRuleDto.getVisibleTo().stream()
                        .map(roleService::toEntity)
                        .collect(Collectors.toList()))
                .groupSheet(productRuleDto.getGroupSheet())
                .predefined(productRuleDto.getPredefined())
                .custom(productRuleDto.getCustom())
                .up(productRuleDto.getUp())
                .groupSheetOf(productRuleDto.getGroupSheetOf())
                .build();
    }

}
