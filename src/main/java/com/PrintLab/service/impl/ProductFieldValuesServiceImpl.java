package com.PrintLab.service.impl;
import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.dto.ProductFieldValuesDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.ProductField;
import com.PrintLab.modal.ProductFieldValues;
import com.PrintLab.repository.ProductFieldValuesRepository;
import com.PrintLab.service.ProductFieldValuesService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductFieldValuesServiceImpl implements ProductFieldValuesService {

    private final ProductFieldValuesRepository productFieldValuesRepository;

    public ProductFieldValuesServiceImpl(ProductFieldValuesRepository productFieldValuesRepository) {
        this.productFieldValuesRepository = productFieldValuesRepository;
    }

    @Override
    public ProductFieldValuesDto save(ProductFieldValuesDto productFieldValuesDto) {
        ProductFieldValues productFieldValues = toEntity(productFieldValuesDto);
        ProductFieldValues createdProductFieldValues = productFieldValuesRepository.save(productFieldValues);
        return toDto(createdProductFieldValues);
    }

    @Override
    public List<ProductFieldValuesDto> getAll() {
        List<ProductFieldValues> productFieldValuesList = productFieldValuesRepository.findAll();
        List<ProductFieldValuesDto> productFieldValuesDtoList = new ArrayList<>();

        for (ProductFieldValues productFieldValues : productFieldValuesList) {
            ProductFieldValuesDto productFieldValuesDto = toDto(productFieldValues);
            productFieldValuesDtoList.add(productFieldValuesDto);
        }
        return productFieldValuesDtoList;
    }

    @Override
    public List<ProductFieldValuesDto> getProductFieldValuesByProductFieldId(Long productFieldId) {
        Optional<List<ProductFieldValues>> optionalProductFieldValuesList = Optional.ofNullable(productFieldValuesRepository.findByproductField_Id(productFieldId));
        if(optionalProductFieldValuesList.isPresent()){
            List<ProductFieldValues> productFieldList = optionalProductFieldValuesList.get();
            List<ProductFieldValuesDto> productFieldValuesDtoList = new ArrayList<>();

            for (ProductFieldValues productFieldValues : productFieldList) {
                ProductFieldValuesDto productFieldValuesDto = toDto(productFieldValues);
                productFieldValuesDtoList.add(productFieldValuesDto);
            }
            return productFieldValuesDtoList;
        } else{
            throw new RecordNotFoundException(String.format("ProductFieldValues not found on Product Field id => %d", productFieldId));
        }
    }

    @Override
    public ProductFieldValuesDto findById(Long id) throws Exception {
        Optional<ProductFieldValues> optionalProductFieldValues = productFieldValuesRepository.findById(id);

        if(optionalProductFieldValues.isPresent()) {
            ProductFieldValues productFieldValues = optionalProductFieldValues.get();
            return toDto(productFieldValues);
        }
        else {
            throw new Exception("Product Field Value not found with ID " + id);
        }
    }

    @Override
    public String deleteById(Long id) {
        try {
            productFieldValuesRepository.deleteById(id);
            return "Product Field Value Deleted";
        }
        catch (Exception e) {
            return "Product Field Value "+id+ " Not found";
        }
    }

    @Override
    public ProductFieldValuesDto updatedProductField(Long id, ProductFieldValues productFieldValues) {
        Optional<ProductFieldValues> optionalProductFieldValues = productFieldValuesRepository.findById(id);

        if(optionalProductFieldValues.isPresent()) {
            ProductFieldValues existingPfV = optionalProductFieldValues.get();
            existingPfV.setName(productFieldValues.getName());
            existingPfV.setStatus(productFieldValues.getStatus());

            ProductFieldValues updatedPfV = productFieldValuesRepository.save(existingPfV);
            return toDto(updatedPfV);
        }
        else {
            throw new IllegalArgumentException("Product Field Value not found with ID"+ id);
        }
    }

    public ProductFieldValuesDto toDto(ProductFieldValues productFieldValues) {
        ProductFieldValuesDto productFieldValuesDto = new ProductFieldValuesDto();
        productFieldValuesDto.setId(productFieldValues.getId());
        productFieldValuesDto.setName(productFieldValues.getName());
        productFieldValuesDto.setStatus(productFieldValues.getStatus());
        return productFieldValuesDto;
    }

    public ProductFieldValues toEntity(ProductFieldValuesDto productFieldValuesDto) {
        ProductFieldValues productFieldValues = new ProductFieldValues();
        productFieldValues.setId(productFieldValuesDto.getId());
        productFieldValues.setName(productFieldValuesDto.getName());
        productFieldValues.setStatus(productFieldValuesDto.getStatus());
        return productFieldValues;
    }
}
