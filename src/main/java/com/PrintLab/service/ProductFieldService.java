package com.PrintLab.service;

import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.modal.ProductField;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductFieldService {
    ProductFieldDto save(ProductFieldDto productFieldDto);
    List<ProductFieldDto> getAll();
    ProductFieldDto findById(Long id);
    ProductFieldDto findByName(String name);
    List<ProductFieldDto> getProductFieldByProductFieldValueId(Long productFieldValueId);
    String deleteById(Long id);
    ProductFieldDto updatedProductField(Long id, ProductField productField);
    void deleteProductFieldValuesById(Long id, Long pfvId);
}
