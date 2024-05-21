package com.PrintLab.service;

import com.PrintLab.dto.ProductRuleDto;

import java.util.List;

public interface ProductRuleService {
    ProductRuleDto save(ProductRuleDto productRuleDto);
    Boolean checkTitle(String productName);
    List<ProductRuleDto> getAllProductRule();
    List<ProductRuleDto> searchByName(String productName);
    ProductRuleDto getProductRuleById(Long id);
    ProductRuleDto update(Long id,ProductRuleDto productRuleDto);
    void deleteById(Long id);
}
