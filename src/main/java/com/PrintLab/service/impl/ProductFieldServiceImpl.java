package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.dto.ProductProcessDto;
import com.PrintLab.dto.UpingDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.ProductField;
import com.PrintLab.modal.ProductFieldValues;
import com.PrintLab.modal.ProductProcess;
import com.PrintLab.repository.ProductFieldRepository;
import com.PrintLab.repository.ProductFieldValuesRepository;
import com.PrintLab.service.ProductFieldService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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

    @Transactional
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
    public ProductFieldDto findById(Long id){
        Optional<ProductField> optionalProductField = productFieldRepository.findById(id);

        if(optionalProductField.isPresent()) {
            ProductField productField = optionalProductField.get();
            return toDto(productField);
        }
        else {
            throw new RecordNotFoundException(String.format("Product Field not found for id => %d", id));
        }
    }

    @Override
    public List<ProductFieldDto> findByName(String name) {
        Optional<List<ProductField>> productFieldList = Optional.ofNullable(productFieldRepository.findByName(name));
        List<ProductFieldDto> productFieldDtoList = new ArrayList<>();

        if(productFieldList.isPresent()){
            for (ProductField productField : productFieldList.get()) {
                ProductFieldDto productFieldDto = toDto(productField);
                productFieldDtoList.add(productFieldDto);
            }
            return productFieldDtoList;
        }
        else {
            throw new RecordNotFoundException(String.format("ProductField not found at => %s", name));
        }
    }

    @Override
    public List<ProductFieldDto> getProductFieldByProductFieldValueId(Long productFieldValueId) {
        Optional<List<ProductField>> optionalProductFieldList = Optional.ofNullable(productFieldRepository.findByProductFieldValuesList_Id(productFieldValueId));
        if(optionalProductFieldList.isPresent()){
            List<ProductField> productFieldList = optionalProductFieldList.get();
            List<ProductFieldDto> productFieldDtoList = new ArrayList<>();

            for (ProductField productField : productFieldList) {
                ProductFieldDto productFieldDto = toDto(productField);
                productFieldDtoList.add(productFieldDto);
            }
            return productFieldDtoList;
        } else{
            throw new RecordNotFoundException(String.format("ProductField not found on Product Field Value id => %d", productFieldValueId));
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
            throw new RecordNotFoundException(String.format("Product Field not found for id => %d", id));
        }
        return null;
    }

    @Transactional
    @Override
    public ProductFieldDto updatedProductField(Long id, ProductField productField) {
        Optional<ProductField> optionalProductField = productFieldRepository.findById(id);
        int count = 0;

        if(optionalProductField.isPresent()) {
            ProductField existingPf = optionalProductField.get();
            existingPf.setName(productField.getName());
            existingPf.setStatus(productField.getStatus());
            existingPf.setType(productField.getType());
            existingPf.setSequence(productField.getSequence());

            List<ProductFieldValues> existingPfValues = existingPf.getProductFieldValuesList();
            List<ProductFieldValues> newPfValues = productField.getProductFieldValuesList();
            List<ProductFieldValues> newValuesToAdd = new ArrayList<>();

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
                    newValuesToAdd.add(newValue);
                    count++;
                }
            }

            if (count > 0) {
                existingPfValues.addAll(newValuesToAdd);
            }

            ProductField updatedPf = productFieldRepository.save(existingPf);
            return toDto(updatedPf);
        }
        else {
            throw new RecordNotFoundException(String.format("Product Field not found for id => %d", id));
        }
    }

//    @Override
//    public ProductFieldValues addProductFieldValues(Long productFieldId, ProductFieldValues productFieldValues) {
//        Optional<ProductField> productField = productFieldRepository.findById(productFieldId);
//        if(productField.isPresent()) {
//            productFieldValues.setProductField(productField.get());
//            return productFieldValuesRepository.save(productFieldValues);
//        }
//        throw new RuntimeException("Product Field not found ");
//    }

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
            } else{
                throw new RecordNotFoundException("Product Field Value not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Product Field not found for id => %d", id));

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
