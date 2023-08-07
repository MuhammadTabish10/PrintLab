package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.modal.ProductField;
import com.PrintLab.modal.ProductFieldValues;
import com.PrintLab.repository.ProductFieldRepository;
import com.PrintLab.repository.ProductFieldValuesRepository;
import com.PrintLab.service.ProductFieldService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ProductFieldServiceImpl implements ProductFieldService {

    private final ProductFieldRepository productFieldRepository;

    private final ProductFieldValuesRepository productFieldValuesRepository;

    public ProductFieldServiceImpl(ProductFieldRepository productFieldRepository, ProductFieldValuesRepository productFieldValuesRepository) {
        this.productFieldRepository = productFieldRepository;
        this.productFieldValuesRepository = productFieldValuesRepository;
    }

    @Override
    public ProductFieldDto save(ProductFieldDto productFieldDto) {
        if(productFieldDto.getCreated_at() == null) {
            productFieldDto.setCreated_at(LocalDate.now());
        }
            ProductField productField = toEntity(productFieldDto);
        ProductField createdProductField = productFieldRepository.save(productField);

        List<ProductFieldValues> productFieldValuesList = productField.getProductFieldValuesList();
        if(productFieldValuesList != null && !productFieldValuesList.isEmpty()){
            for (ProductFieldValues productFieldValues : productFieldValuesList) {
                productFieldValues.setProductField(createdProductField);
                productFieldValuesRepository.save(productFieldValues);
            }
            createdProductField.setProductFieldValuesList(productFieldValuesList);
            productFieldRepository.save(createdProductField);
        }

        return toDto(createdProductField);
    }

    @Override
    public List<ProductFieldDto> getAll() {
        List<ProductField> productFieldList = productFieldRepository.findAll();
        List<ProductFieldDto> productFieldDtoList = new ArrayList<>();

        for (ProductField productField : productFieldList) {
            ProductFieldDto productFieldDto = toDto(productField);
            productFieldDtoList.add(productFieldDto);
        }
        return productFieldDtoList;
    }

    @Override
    public ProductFieldDto findById(Long id) throws Exception {
        Optional<ProductField> optionalProductField = productFieldRepository.findById(id);

        if(optionalProductField.isPresent()) {
            ProductField productField = optionalProductField.get();
            return toDto(productField);
        }
        else {
            throw new Exception("Product Field not found with ID " + id);
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<ProductField> optionalProductField = productFieldRepository.findById(id);

        if(optionalProductField.isPresent()) {
            ProductField productField = optionalProductField.get();
            productFieldRepository.deleteById(id);
        }
        else {
            throw new IllegalArgumentException("Product Field not found with ID " + id);
        }
        return null;
    }

    @Override
    public ProductFieldDto updatedProductField(Long id, ProductField productField) {
        Optional<ProductField> optionalProductField = productFieldRepository.findById(id);

        if(optionalProductField.isPresent()) {
            ProductField existingPf = optionalProductField.get();
            existingPf.setName(productField.getName());
            existingPf.setStatus(productField.getStatus());
            existingPf.setType(productField.getType());

            List<ProductFieldValues> existingPfValues = existingPf.getProductFieldValuesList();
            List<ProductFieldValues> newPfValues = productField.getProductFieldValuesList();

            for(ProductFieldValues newValue : newPfValues) {
                Optional<ProductFieldValues> existingValue = existingPfValues.stream()
                        .filter(pfValue -> pfValue.getId().equals(newValue.getId())).findFirst();
                if(existingValue.isPresent()) {
                    ProductFieldValues existingPfValue = existingValue.get();
                    existingPfValue.setName(newValue.getName());
                    existingPfValue.setStatus(newValue.getStatus());
                }
                else {
                    newValue.setProductField(existingPf);
                    existingPfValues.add(newValue);
                }
            }

            ProductField updatedPf = productFieldRepository.save(existingPf);
            return toDto(updatedPf);
        }
        else {
            throw new IllegalArgumentException("Product Field not found with ID"+ id);
        }
    }

    @Override
    public ProductFieldValues addProductFieldValues(Long productFieldId, ProductFieldValues productFieldValues) {
        Optional<ProductField> productField = productFieldRepository.findById(productFieldId);
        if(productField.isPresent()) {
            productFieldValues.setProductField(productField.get());
            return productFieldValuesRepository.save(productFieldValues);
        }
        throw new RuntimeException("Product Field not found ");
    }

    @Override
    public void deleteProductFieldValuesById(Long id, Long pfvId) {
        Optional<ProductField> optionalProductField = productFieldRepository.findById(id);
        if (optionalProductField.isPresent()) {
            ProductField productField = optionalProductField.get();

            // Find the ProductFieldValues entity with the provided pfvId
            Optional<ProductFieldValues> optionalProductFieldValues = productField.getProductFieldValuesList()
                    .stream()
                    .filter(pfv -> pfv.getId().equals(pfvId))
                    .findFirst();

            if (optionalProductFieldValues.isPresent()) {
                ProductFieldValues productFieldValuesToDelete = optionalProductFieldValues.get();
                // Remove the ProductFieldValues entity from the list
                productField.getProductFieldValuesList().remove(productFieldValuesToDelete);

                // Delete the ProductFieldValues from the database using the repository
                productFieldValuesRepository.delete(productFieldValuesToDelete);

                // Save the updated ProductField entity to reflect the changes in the database
                productFieldRepository.save(productField);
            }
        } else {
            throw new RuntimeException("Product Field not found.");

        }
    }


    public ProductFieldDto toDto(ProductField productField) {
       return ProductFieldDto.builder()
               .id(productField.getId())
               .name(productField.getName())
               .status(productField.getStatus())
               .created_at(productField.getCreated_at())
               .sequence(productField.getSequence())
               .type(productField.getType())
               .productFieldValuesList(productField.getProductFieldValuesList())
               .build();
    }

    public ProductField toEntity(ProductFieldDto productFieldDto) {
        return ProductField.builder()
                .id(productFieldDto.getId())
                .name(productFieldDto.getName())
                .status(productFieldDto.getStatus())
                .created_at(productFieldDto.getCreated_at())
                .sequence(productFieldDto.getSequence())
                .type(productFieldDto.getType())
                .productFieldValuesList(productFieldDto.getProductFieldValuesList())
                .build();
    }


}
