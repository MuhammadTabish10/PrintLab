package com.PrintLab.service;

import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.dto.ProductRuleDto;

import java.util.List;

public interface ProductRuleService {
    ProductRuleDto save(ProductRuleDto productRuleDto);
    Boolean checkTitle(String productName);
    List<ProductRuleDto> getAllProductRule();
    List<ProductRuleDto> searchByName(String productName);
    ProductRuleDto getProductRuleById(Long id);
    ProductRuleDto update(Long id,ProductRuleDto productRuleDto);
    List<ProductRuleDto> getAllProductRuleInGroupSheet();
    void deleteById(Long id);

    PaginationResponse getAllPaginatedProductRule(Integer pageNumber, Integer pageSize, ProductRuleDto searchCriteria);
}
