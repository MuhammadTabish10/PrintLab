package com.PrintLab.service.impl;

import com.PrintLab.dto.*;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.*;
import com.PrintLab.repository.*;
import com.PrintLab.service.ProductDefinitionService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductDefinitionServiceImpl implements ProductDefinitionService {
    private final ProductDefinitionRepository productDefinitionRepository;
    private final ProductDefinitionFieldRepository productDefinitionFieldRepository;
    private final ProductDefinitionProcessRepository productDefinitionProcessRepository;
    private final ProductProcessRepository productProcessRepository;
    private final ProductFieldRepository productFieldRepository;
    private final ProductFieldValuesRepository productFieldValuesRepository;
    private final VendorRepository vendorRepository;
    private final ProductFieldServiceImpl productFieldService;
    private final ProductFieldValuesServiceImpl productFieldValuesService;
    private final ProductProcessServiceImpl productProcessService;
    private final VendorServiceImpl vendorService;

    public ProductDefinitionServiceImpl(ProductDefinitionRepository productDefinitionRepository, ProductDefinitionFieldRepository productDefinitionFieldRepository, ProductDefinitionProcessRepository productDefinitionProcessRepository, ProductProcessRepository productProcessRepository, ProductFieldRepository productFieldRepository, ProductFieldValuesRepository productFieldValuesRepository, VendorRepository vendorRepository, ProductFieldServiceImpl productFieldService, ProductFieldValuesServiceImpl productFieldValuesService, ProductProcessServiceImpl productProcessService, VendorServiceImpl vendorService) {
        this.productDefinitionRepository = productDefinitionRepository;
        this.productDefinitionFieldRepository = productDefinitionFieldRepository;
        this.productDefinitionProcessRepository = productDefinitionProcessRepository;
        this.productProcessRepository = productProcessRepository;
        this.productFieldRepository = productFieldRepository;
        this.productFieldValuesRepository = productFieldValuesRepository;
        this.vendorRepository = vendorRepository;
        this.productFieldService = productFieldService;
        this.productFieldValuesService = productFieldValuesService;
        this.productProcessService = productProcessService;
        this.vendorService = vendorService;
    }


    @Transactional
    @Override
    public ProductDefinitionDto save(ProductDefinitionDto productDefinitionDto) {
        ProductDefinition productDefinition = toEntity(productDefinitionDto);
        ProductDefinition createdProductDefinition = productDefinitionRepository.save(productDefinition);

        List<ProductDefinitionField> productDefinitionFieldList = productDefinition.getProductDefinitionFieldList();
        if(productDefinitionFieldList != null && !productDefinitionFieldList.isEmpty()){
            for (ProductDefinitionField productDefinitionField : productDefinitionFieldList) {
                productDefinitionField.setProductField(productFieldRepository.findById(productDefinitionField.getProductField().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Product Field not found for id => %d", productDefinitionField.getProductField().getId()))));
                productDefinitionField.setProductFieldValues(productFieldValuesRepository.findById(productDefinitionField.getProductFieldValues().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Product Field Value not found for id => %d",productDefinitionField.getProductFieldValues().getId()))));
                productDefinitionField.setProductDefinition(createdProductDefinition);
                productDefinitionFieldRepository.save(productDefinitionField);
            }
        }

        List<ProductDefinitionProcess> productDefinitionProcessList = productDefinition.getProductDefinitionProcessList();
        if(productDefinitionProcessList != null && !productDefinitionProcessList.isEmpty()){
            for (ProductDefinitionProcess productDefinitionProcess : productDefinitionProcessList) {
                productDefinitionProcess.setProductProcess(productProcessRepository.findById(productDefinitionProcess.getProductProcess().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Product Process not found for id => %d", productDefinitionProcess.getProductProcess().getId()))));
                productDefinitionProcess.setVendor(vendorRepository.findById(productDefinitionProcess.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found for id => %d", productDefinitionProcess.getVendor().getId()))));
                productDefinitionProcess.setProductDefinition(createdProductDefinition);
                productDefinitionProcessRepository.save(productDefinitionProcess);
            }
        }
        createdProductDefinition.setProductDefinitionFieldList(productDefinitionFieldList);
        createdProductDefinition.setProductDefinitionProcessList(productDefinitionProcessList);
        productDefinitionRepository.save(createdProductDefinition);

        return toDto(createdProductDefinition);
    }

    @Override
    public List<ProductDefinitionDto> getAll() {
        List<ProductDefinition> productDefinitionList = productDefinitionRepository.findAll();
        List<ProductDefinitionDto> productDefinitionDtoList = new ArrayList<>();

        for (ProductDefinition productDefinition : productDefinitionList) {
            ProductDefinitionDto productDefinitionDto = toDto(productDefinition);
            productDefinitionDtoList.add(productDefinitionDto);
        }
        return productDefinitionDtoList;
    }

    @Override
    public ProductDefinitionDto findById(Long id) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();
            return toDto(productDefinition);
        }
        throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
    }

    @Override
    public List<ProductDefinitionDto> findByTitle(String title) {
        Optional<List<ProductDefinition>> productDefinitionList = Optional.ofNullable(productDefinitionRepository.findByTitle(title));
        List<ProductDefinitionDto> productDefinitionDtoList = new ArrayList<>();

        if(productDefinitionList.isPresent()){
            for (ProductDefinition productDefinition : productDefinitionList.get()) {
                ProductDefinitionDto productDefinitionDto = toDto(productDefinition);
                productDefinitionDtoList.add(productDefinitionDto);
            }
            return productDefinitionDtoList;
        }
        else {
            throw new RecordNotFoundException(String.format("ProductDefinition not found at => %s", title));
        }
    }

    @Override
    public List<ProductDefinitionDto> getProductDefinitionByProductFieldId(Long productFieldId) {
        Optional<List<ProductDefinition>> optionalProductDefinitionList = Optional.ofNullable(productDefinitionRepository.findByProductDefinitionFieldList_ProductField_Id(productFieldId));
        if(optionalProductDefinitionList.isPresent()){
            List<ProductDefinition> productDefinitionList = optionalProductDefinitionList.get();
            List<ProductDefinitionDto> productDefinitionDtoList = new ArrayList<>();

            for (ProductDefinition productDefinition : productDefinitionList) {
                ProductDefinitionDto productDefinitionDto = toDto(productDefinition);
                productDefinitionDtoList.add(productDefinitionDto);
            }
            return productDefinitionDtoList;
        } else{
            throw new RecordNotFoundException(String.format("ProductDefinition not found on ProductField id => %d", productFieldId));
        }
    }

    @Override
    public List<ProductDefinitionDto> getProductDefinitionByProductProcessId(Long productProcessId) {
        Optional<List<ProductDefinition>> optionalProductDefinitionList = Optional.ofNullable(productDefinitionRepository.findByProductDefinitionProcessList_ProductProcess_Id(productProcessId));
        if(optionalProductDefinitionList.isPresent()){
            List<ProductDefinition> productDefinitionList = optionalProductDefinitionList.get();
            List<ProductDefinitionDto> productDefinitionDtoList = new ArrayList<>();

            for (ProductDefinition productDefinition : productDefinitionList) {
                ProductDefinitionDto productDefinitionDto = toDto(productDefinition);
                productDefinitionDtoList.add(productDefinitionDto);
            }
            return productDefinitionDtoList;
        } else{
            throw new RecordNotFoundException(String.format("ProductDefinition not found on ProductProcess id => %d", productProcessId));
        }
    }

    @Override
    public List<ProductDefinitionDto> getProductDefinitionByVendorId(Long vendorId) {
        Optional<List<ProductDefinition>> optionalProductDefinitionList = Optional.ofNullable(productDefinitionRepository.findByProductDefinitionProcessList_Vendor_Id(vendorId));
        if(optionalProductDefinitionList.isPresent()){
            List<ProductDefinition> productDefinitionList = optionalProductDefinitionList.get();
            List<ProductDefinitionDto> productDefinitionDtoList = new ArrayList<>();

            for (ProductDefinition productDefinition : productDefinitionList) {
                ProductDefinitionDto productDefinitionDto = toDto(productDefinition);
                productDefinitionDtoList.add(productDefinitionDto);
            }
            return productDefinitionDtoList;
        } else{
            throw new RecordNotFoundException(String.format("ProductDefinition not found on Vendor id => %d", vendorId));
        }
    }

    @Override
    public ProductDefinitionDto updateProductDefinition(Long id, ProductDefinitionDto productDefinitionDto) {
        ProductDefinition productDefinition = toEntity(productDefinitionDto);
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        int countPdf = 0;
        int countPdp = 0;

        if (optionalProductDefinition.isPresent()) {
            ProductDefinition existingProductDefinition = optionalProductDefinition.get();
            existingProductDefinition.setTitle(productDefinition.getTitle());
            existingProductDefinition.setStatus(productDefinition.getStatus());
            existingProductDefinition.setIs_public(productDefinition.getIs_public());

            List<ProductDefinitionField> existingPdfValues = existingProductDefinition.getProductDefinitionFieldList();
            List<ProductDefinitionField> newPdfValues = productDefinition.getProductDefinitionFieldList();
            List<ProductDefinitionField> newValuesOfPdfToAdd = new ArrayList<>();

            for (ProductDefinitionField newValue : newPdfValues) {
                Optional<ProductDefinitionField> existingValue = existingPdfValues.stream()
                        .filter(value -> value.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    ProductDefinitionField existingPdfValue = existingValue.get();
                    existingPdfValue.setValue(newValue.getValue());
                    existingPdfValue.setProductField(productFieldRepository.findById(newValue.getProductField().getId())
                            .orElseThrow(() -> new RecordNotFoundException(String.format("Product Field not found for id => %d", newValue.getProductField().getId()))));
                    existingPdfValue.setProductFieldValues(productFieldValuesRepository.findById(newValue.getProductFieldValues().getId())
                            .orElseThrow(()-> new RecordNotFoundException(String.format("Product Field Value not found for id => %d", newValue.getProductFieldValues().getId()))));
                } else {
                    newValue.setProductDefinition(existingProductDefinition);
                    newValuesOfPdfToAdd.add(newValue);
                    countPdf++;
                }
            }

            List<ProductDefinitionProcess> existingPdpValues = existingProductDefinition.getProductDefinitionProcessList();
            List<ProductDefinitionProcess> newPdpValues = productDefinition.getProductDefinitionProcessList();
            List<ProductDefinitionProcess> newValuesOfPdpToAdd = new ArrayList<>();

            for (ProductDefinitionProcess newValue : newPdpValues) {
                Optional<ProductDefinitionProcess> existingValue = existingPdpValues.stream()
                        .filter(value -> value.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    ProductDefinitionProcess existingPdpValue = existingValue.get();
                    existingPdpValue.setVendor(vendorRepository.findById(newValue.getVendor().getId())
                            .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found for id => %d", newValue.getVendor().getId()))));
                    existingPdpValue.setProductProcess(productProcessRepository.findById(newValue.getProductProcess().getId())
                            .orElseThrow(() -> new RecordNotFoundException(String.format("Product Process not found for id => %d", newValue.getProductProcess().getId()))));
                } else {
                    newValue.setProductDefinition(existingProductDefinition);
                    newValuesOfPdpToAdd.add(newValue);
                    countPdp++;
                }
            }

            if (countPdf > 0) {
                existingPdfValues.addAll(newValuesOfPdfToAdd);
            }
            if (countPdp > 0) {
                existingPdpValues.addAll(newValuesOfPdpToAdd);
            }

            ProductDefinition updatedProductDefinition = productDefinitionRepository.save(existingProductDefinition);
            return toDto(updatedProductDefinition);

        } else {
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
        }
    }

    @Override
    public void deleteProductDefinition(Long id) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();
            productDefinitionRepository.deleteById(id);
        }
        else{
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
        }
    }

    @Override
    public void deleteProductDefinitionFieldById(Long id, Long productDefinitionFieldId) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();

            Optional<ProductDefinitionField> optionalProductDefinitionField = productDefinition.getProductDefinitionFieldList()
                    .stream()
                    .filter(pdf -> pdf.getId().equals(productDefinitionFieldId))
                    .findFirst();

            if (optionalProductDefinitionField.isPresent()) {
                ProductDefinitionField productDefinitionFieldToDelete = optionalProductDefinitionField.get();
                productDefinition.getProductDefinitionFieldList().remove(productDefinitionFieldToDelete);
                productDefinitionFieldRepository.delete(productDefinitionFieldToDelete);
                productDefinitionRepository.save(productDefinition);
            } else{
                throw new RecordNotFoundException("Product Definition Field not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
        }
    }

    @Override
    public void deleteProductDefinitionProcessById(Long id, Long productDefinitionProcessId) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();

            Optional<ProductDefinitionProcess> optionalProductDefinitionProcess = productDefinition.getProductDefinitionProcessList()
                    .stream()
                    .filter(pdp -> pdp.getId().equals(productDefinitionProcessId))
                    .findFirst();

            if (optionalProductDefinitionProcess.isPresent()) {
                ProductDefinitionProcess productDefinitionProcessToDelete = optionalProductDefinitionProcess.get();
                productDefinition.getProductDefinitionProcessList().remove(productDefinitionProcessToDelete);
                productDefinitionProcessRepository.delete(productDefinitionProcessToDelete);
                productDefinitionRepository.save(productDefinition);
            } else{
                throw new RecordNotFoundException("Product Definition Process not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
        }
    }

    public ProductDefinitionDto toDto(ProductDefinition productDefinition)
    {
        List<ProductDefinitionFieldDto> productDefinitionFieldDto = new ArrayList<>();
        for (ProductDefinitionField productDefinitionField : productDefinition.getProductDefinitionFieldList()) {
            ProductDefinitionFieldDto dto = ProductDefinitionFieldDto.builder()
                    .id(productDefinitionField.getId())
                    .value(productDefinitionField.getValue())
                    .productField(productFieldService.toDto(productFieldRepository.findById(productDefinitionField.getProductField().getId())
                            .orElseThrow(()-> new RecordNotFoundException("Product Field not found"))))
                    .productFieldValues(productFieldValuesService.toDto(productFieldValuesRepository.findById(productDefinitionField.getProductFieldValues().getId())
                            .orElseThrow(()-> new RecordNotFoundException("Product Field Value not found"))))
                    .build();
            productDefinitionFieldDto.add(dto);
        }

        List<ProductDefinitionProcessDto> productDefinitionProcessDto = new ArrayList<>();
        for(ProductDefinitionProcess productDefinitionProcess : productDefinition.getProductDefinitionProcessList()) {
            ProductDefinitionProcessDto dto = ProductDefinitionProcessDto.builder()
                    .id(productDefinitionProcess.getId())
                    .productProcess(productProcessService.toDto(productProcessRepository.findById(productDefinitionProcess.getProductProcess().getId())
                            .orElseThrow(()-> new RecordNotFoundException("Product Process not found"))))
                    .vendor(vendorService.toDto(vendorRepository.findById(productDefinitionProcess.getVendor().getId())
                            .orElseThrow(()-> new RecordNotFoundException("Vendor not found"))))
                    .build();
            productDefinitionProcessDto.add(dto);
        }

        return ProductDefinitionDto.builder()
                .id(productDefinition.getId())
                .title(productDefinition.getTitle())
                .status(productDefinition.getStatus())
                .is_public(productDefinition.getIs_public())
                .productDefinitionFieldList(productDefinitionFieldDto)
                .productDefinitionProcessDtoList(productDefinitionProcessDto)
                .build();
    }


    public ProductDefinition toEntity(ProductDefinitionDto productDefinitionDto) {
        ProductDefinition productDefinition = ProductDefinition.builder()
                .id(productDefinitionDto.getId())
                .title(productDefinitionDto.getTitle())
                .status(productDefinitionDto.getStatus())
                .is_public(productDefinitionDto.getIs_public())
                .build();

        List<ProductDefinitionField> productDefinitionFieldList = new ArrayList<>();
        for (ProductDefinitionFieldDto dto : productDefinitionDto.getProductDefinitionFieldList()) {
            ProductField productField = ProductField.builder()
                    .id(dto.getProductField().getId())
                    .build();
            ProductFieldValues productFieldValues = ProductFieldValues.builder()
                    .id(dto.getProductFieldValues().getId())
                    .build();

            ProductDefinitionField productDefinitionField = ProductDefinitionField.builder()
                    .id(dto.getId())
                    .productDefinition(productDefinition)
                    .productField(productField)
                    .productFieldValues(productFieldValues)
                    .value(dto.getValue())
                    .build();

            productDefinitionFieldList.add(productDefinitionField);
        }

        List<ProductDefinitionProcess> productDefinitionProcessList = new ArrayList<>();
        for (ProductDefinitionProcessDto dto : productDefinitionDto.getProductDefinitionProcessDtoList()) {
            Vendor vendor = Vendor.builder()
                    .id(dto.getVendor().getId())
                    .build();

            ProductProcess productProcess = ProductProcess.builder()
                    .id(dto.getProductProcess().getId())
                    .build();

            ProductDefinitionProcess productDefinitionProcess = ProductDefinitionProcess.builder()
                    .id(dto.getId())
                    .productDefinition(productDefinition)
                    .productProcess(productProcess)
                    .vendor(vendor)
                    .build();

            productDefinitionProcessList.add(productDefinitionProcess);
        }

        productDefinition.setProductDefinitionFieldList(productDefinitionFieldList);
        productDefinition.setProductDefinitionProcessList(productDefinitionProcessList);
        return productDefinition;
    }
}
