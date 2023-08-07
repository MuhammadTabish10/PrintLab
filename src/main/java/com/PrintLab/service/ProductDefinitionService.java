package com.PrintLab.service;

import com.PrintLab.dto.ProductDefinitionDto;
import com.PrintLab.modal.ProductDefinition;
import com.PrintLab.modal.ProductField;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface ProductDefinitionService {
    ProductDefinitionDto save(ProductDefinitionDto productDefinitionDto);

    ProductField addProductField(Long productDefinitionId, ProductField productField);

    List<ProductDefinitionDto> getAll();

    ProductDefinitionDto findById(Long id);

    ProductDefinitionDto updateProductDefinition(Long id, ProductDefinition productDefinition);

    void deleteProductDefinition(Long id);
}
