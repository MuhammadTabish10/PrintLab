package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductDefinitionDto;
import com.PrintLab.modal.ProductDefinition;
import com.PrintLab.modal.ProductDefinitionField;
import com.PrintLab.modal.ProductField;
import com.PrintLab.repository.ProductDefinitionFieldRepository;
import com.PrintLab.repository.ProductFieldRepository;
import com.PrintLab.repository.ProductDefinitionRepository;
import com.PrintLab.service.ProductDefinitionService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductDefinitionServiceImpl implements ProductDefinitionService {

    private final ProductDefinitionRepository productDefinitionRepository;

    private final ProductDefinitionFieldRepository productDefinitionFieldRepository;

    private final ProductFieldRepository productFieldRepository;

    public ProductDefinitionServiceImpl(ProductDefinitionRepository productDefinitionRepository, ProductDefinitionFieldRepository productDefinitionFieldRepository, ProductFieldRepository productFieldRepository) {
        this.productDefinitionRepository = productDefinitionRepository;
        this.productDefinitionFieldRepository = productDefinitionFieldRepository;
        this.productFieldRepository = productFieldRepository;
    }

    @Override
    public ProductDefinitionDto save(ProductDefinitionDto productDefinitionDto) {
        ProductDefinition productDefinition = toEntity(productDefinitionDto);

        ProductDefinition createdProductionDefinition = productDefinitionRepository.save(productDefinition);

        List<ProductDefinitionField> productDefinitionFieldList = createdProductionDefinition.getProductDefinitionFieldList();
        if(productDefinitionFieldList != null && !productDefinitionFieldList.isEmpty()) {
            for(ProductDefinitionField productDefinitionField : productDefinitionFieldList) {
                productDefinitionField.setProductDefinition(createdProductionDefinition);

                productDefinitionFieldRepository.save(productDefinitionField);
            }
            createdProductionDefinition.setProductDefinitionFieldList(productDefinitionFieldList);
            productDefinitionRepository.save(createdProductionDefinition);
        }

        return toDto(createdProductionDefinition);
    }

    @Override
    public ProductField addProductField(Long productDefinitionId, ProductField productField) {
        Optional<ProductDefinition> productDefinition = productDefinitionRepository.findById(productDefinitionId);
        if(productDefinition.isPresent()) {
            productField.setProductDefinition(productDefinition.get());
            return productFieldRepository.save(productField);
        }
        throw new RuntimeException("Product Definition Not found");
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
        throw new RuntimeException("Product Definition not found with ID" + id);
    }

    @Override
    public ProductDefinitionDto updateProductDefinition(Long id, ProductDefinition productDefinition) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if(optionalProductDefinition.isPresent()) {
            ProductDefinition existingProductDefinition = optionalProductDefinition.get();
            existingProductDefinition.setTitle(productDefinition.getTitle());
            existingProductDefinition.setStatus(productDefinition.getStatus());

            ProductDefinition updatedProductDefinition = productDefinitionRepository.save(existingProductDefinition);
            return toDto(updatedProductDefinition);
        }
        throw new IllegalArgumentException("Product Definition not found with ID" + id);
    }

    @Override
    public void deleteProductDefinition(Long id) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();
            productDefinitionRepository.deleteById(id);
        }
        else{
            throw new IllegalArgumentException("Product Definition not found with ID" + id);
        }
    }

    public ProductDefinitionDto toDto(ProductDefinition productDefinition) {
        return ProductDefinitionDto.builder()
                .id(productDefinition.getId())
                .title(productDefinition.getTitle())
                .status(productDefinition.getStatus())
                .productDefinitionFieldList(productDefinition.getProductDefinitionFieldList())
                .build();
    }

    public ProductDefinition toEntity(ProductDefinitionDto productDefinitionDto) {
        return ProductDefinition.builder()
                .id(productDefinitionDto.getId())
                .title(productDefinitionDto.getTitle())
                .status(productDefinitionDto.getStatus())
                .productDefinitionFieldList(productDefinitionDto.getProductDefinitionFieldList())
                .build();
    }
}
