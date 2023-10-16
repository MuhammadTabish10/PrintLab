package com.PrintLab.service;

import com.PrintLab.dto.ProductRuleDto;

import java.util.List;

public interface ProductRuleService {
    ProductRuleDto save(ProductRuleDto productRuleDto);
    List<ProductRuleDto> getAllProductRule();

    ProductRuleDto getProductRuleById(Long id);
    ProductRuleDto update(Long id,ProductRuleDto productRuleDto);
    void deleteById(Long id);
}
