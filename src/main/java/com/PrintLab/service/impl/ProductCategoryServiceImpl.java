package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductCategoryDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.ProductCategory;
import com.PrintLab.repository.ProductCategoryRepository;
import com.PrintLab.service.ProductCategoryService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryServiceImpl(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    @Override
    @Transactional
    public ProductCategoryDto save(ProductCategoryDto productCategoryDto) {
        ProductCategory productCategory = toEntity(productCategoryDto);
        productCategory.setStatus(true);
        return toDto(productCategoryRepository.save(productCategory));
    }

    @Override
    public List<ProductCategoryDto> getAll() {
        List<ProductCategory> productCategoryList = productCategoryRepository.findAllByStatusIsTrue();
        List<ProductCategoryDto> productCategoryDtoList = new ArrayList<>();

        for (ProductCategory productCategory : productCategoryList) {
            ProductCategoryDto productCategoryDto = toDto(productCategory);
            productCategoryDtoList.add(productCategoryDto);
        }
        return productCategoryDtoList;
    }

    @Override
    public ProductCategoryDto findById(Long id) {
        Optional<ProductCategory> optionalProductCategory = productCategoryRepository.findById(id);

        if (optionalProductCategory.isPresent()) {
            ProductCategory productCategory = optionalProductCategory.get();
            return toDto(productCategory);
        } else {
            throw new RecordNotFoundException(String.format("Product Category not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public String deleteById(Long id) {
        Optional<ProductCategory> optionalProductCategory = productCategoryRepository.findById(id);

        if (optionalProductCategory.isPresent()) {
            ProductCategory productCategory = optionalProductCategory.get();
            productCategoryRepository.setStatusInactive(id);
        } else {
            throw new RecordNotFoundException(String.format("Product Category not found for id => %d", id));
        }
        return null;
    }

    @Override
    @Transactional
    public ProductCategoryDto updatedProductCategory(Long id, ProductCategoryDto productCategoryDto) {
        Optional<ProductCategory> optionalProductCategory = productCategoryRepository.findById(id);
        if (optionalProductCategory.isPresent()) {
            ProductCategory existingProductCategory = optionalProductCategory.get();
            existingProductCategory.setName(productCategoryDto.getName());

            if (productCategoryDto.getParentProductCategory()!= null) {
                ProductCategory parentCategory = productCategoryRepository.findById(productCategoryDto.getParentProductCategory().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Parent Product Category not found"));
                existingProductCategory.setParentProductCategory(parentCategory);
            }

            ProductCategory updatedProductCategory = productCategoryRepository.save(existingProductCategory);
            return toDto(updatedProductCategory);
        } else {
            throw new RecordNotFoundException(String.format("Product Category not found for id => %d", id));
        }
    }

    @Override
    public List<ProductCategoryDto> searchByCategory(Long id) {
        List<ProductCategory> productCategoryList = productCategoryRepository.findNameByParentProductCategoryIdAndStatusIsTrue(id);
        return productCategoryList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProductCategoryDto toDto(ProductCategory productCategory) {
        return ProductCategoryDto.builder()
                .id(productCategory.getId())
                .name(productCategory.getName())
                .parentProductCategory(productCategory.getParentProductCategory())
                .status(productCategory.getStatus())
                .build();
    }

    public ProductCategory toEntity(ProductCategoryDto productCategoryDto) {
        return ProductCategory.builder()
                .id(productCategoryDto.getId())
                .name(productCategoryDto.getName())
                .parentProductCategory(productCategoryDto.getParentProductCategory())
                .status(productCategoryDto.getStatus())
                .build();
    }
}