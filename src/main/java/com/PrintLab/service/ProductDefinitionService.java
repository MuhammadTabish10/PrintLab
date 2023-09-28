package com.PrintLab.service;

import com.PrintLab.dto.ProductDefinitionDto;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface ProductDefinitionService {
    ProductDefinitionDto save(ProductDefinitionDto productDefinitionDto);
    List<ProductDefinitionDto> getAll();
    ProductDefinitionDto findById(Long id);
    ProductDefinitionDto findByTitle(String title);
    List<ProductDefinitionDto> searchByTitle(String title);
    ProductDefinitionDto updateProductDefinition(Long id, ProductDefinitionDto productDefinitionDto);
    void deleteProductDefinition(Long id);
    void deleteNewProductById(Long id, Long productDefinitionFieldId);
    void deleteProductGsmById(Long productDefinitionId, Long newProductId, Long productGsmId);

}
