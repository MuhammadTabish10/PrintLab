package com.PrintLab.service;

import com.PrintLab.dto.ProductFieldValuesDto;
import com.PrintLab.model.ProductFieldValues;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductFieldValuesService {
    ProductFieldValuesDto save(ProductFieldValuesDto productFieldValuesDto);

    List<ProductFieldValuesDto> getAll();
    List<ProductFieldValuesDto> getProductFieldValuesByProductFieldId(Long productFieldId);

    ProductFieldValuesDto findById(Long id) throws Exception;

    String deleteById(Long id);

    ProductFieldValuesDto updatedProductField(Long id, ProductFieldValues productFieldValues);
}
