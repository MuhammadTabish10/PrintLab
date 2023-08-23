package com.PrintLab.service;

import com.PrintLab.dto.PaperSizeDto;
import com.PrintLab.dto.ProductDefinitionDto;
import com.PrintLab.dto.ProductFieldDto;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface ProductDefinitionService {
    ProductDefinitionDto save(ProductDefinitionDto productDefinitionDto);
    List<ProductDefinitionDto> getAll();
    ProductDefinitionDto findById(Long id);
    ProductDefinitionDto findByTitle(String title);
    List<ProductDefinitionDto> getProductDefinitionByProductFieldId(Long productFieldId);
    List<ProductDefinitionDto> getProductDefinitionByProductProcessId(Long productProcessId);
    List<ProductDefinitionDto> getProductDefinitionByVendorId(Long vendorId);
    ProductDefinitionDto updateProductDefinition(Long id, ProductDefinitionDto productDefinitionDto);
    void deleteProductDefinition(Long id);
    void deleteProductDefinitionFieldById(Long id, Long productDefinitionFieldId);
    void deleteSelectedValueById(Long id, Long productDefinitionFieldId, Long selectedValueId);
    void deleteProductDefinitionProcessById(Long id, Long productDefinitionProcessId);

}
