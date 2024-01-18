package com.PrintLab.service;

import com.PrintLab.dto.ProductCategoryDto;

import java.util.List;

public interface ProductCategoryService {
    ProductCategoryDto save(ProductCategoryDto productCategoryDto);
    List<ProductCategoryDto> getAll();
    ProductCategoryDto findById(Long id);
    String deleteById(Long id);
    ProductCategoryDto updatedProductCategory(Long id, ProductCategoryDto productCategoryDto);
}
