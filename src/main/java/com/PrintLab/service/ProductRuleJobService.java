package com.PrintLab.service;

import com.PrintLab.dto.ProductRuleJobDto;

import java.util.List;

public interface ProductRuleJobService {
    List<ProductRuleJobDto> findAll();

    ProductRuleJobDto getById(Long id);

    ProductRuleJobDto save(ProductRuleJobDto productRuleJobDto);

    ProductRuleJobDto update(Long id, ProductRuleJobDto productRuleJobDto);

    void delete(Long id);

    Boolean checkTitle(String productName);
}
