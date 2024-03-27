package com.PrintLab.service;

import com.PrintLab.dto.BusinessUnitCategoryDto;

import java.util.List;

public interface BusinessUnitCategoryService {
    BusinessUnitCategoryDto createCategory(BusinessUnitCategoryDto categoryDto);

    List<BusinessUnitCategoryDto> getAllCategories();

    BusinessUnitCategoryDto getCategoryById(Long categoryId);

    BusinessUnitCategoryDto updateCategory(Long categoryId, BusinessUnitCategoryDto categoryDto);

    void deleteCategory(Long categoryId);
    void deleteProcess(Long processId);

    Boolean getCategoryByName(String name);

    List<BusinessUnitCategoryDto> getAllByName(String name);
}
