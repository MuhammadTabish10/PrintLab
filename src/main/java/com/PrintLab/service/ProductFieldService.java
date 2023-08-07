package com.PrintLab.service;

import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.modal.ProductField;
import com.PrintLab.modal.ProductFieldValues;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductFieldService {
    ProductFieldDto save(ProductFieldDto productFieldDto);

    List<ProductFieldDto> getAll();

    ProductFieldDto findById(Long id) throws Exception;

    String deleteById(Long id);

    ProductFieldDto updatedProductField(Long id, ProductField productField);

    ProductFieldValues addProductFieldValues(Long productFieldId, ProductFieldValues productFieldValues);

    void deleteProductFieldValuesById(Long id, Long pfvId);
}
