package com.PrintLab.service;

import com.PrintLab.dto.ProductDefinitionDto;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface ProductDefinitionService {
    ProductDefinitionDto save(ProductDefinitionDto productDefinitionDto);
    List<ProductDefinitionDto> getAll();
    ProductDefinitionDto findById(Long id);
    ProductDefinitionDto updateProductDefinition(Long id, ProductDefinitionDto productDefinitionDto);
    void deleteProductDefinition(Long id);
    void deleteProductDefinitionFieldById(Long id, Long productDefinitionFieldId);
    void deleteProductDefinitionProcessById(Long id, Long productDefinitionProcessId);

}
