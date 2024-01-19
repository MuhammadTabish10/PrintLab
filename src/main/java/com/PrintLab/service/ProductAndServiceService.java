package com.PrintLab.service;

import com.PrintLab.dto.ProductAndServiceDto;

import java.util.List;

public interface ProductAndServiceService {
    ProductAndServiceDto save(ProductAndServiceDto productAndServiceDto);
    List<ProductAndServiceDto> getAll();
    ProductAndServiceDto findById(Long id);
    String deleteById(Long id);
    ProductAndServiceDto updateProductAndService(Long id, ProductAndServiceDto productAndServiceDto);
}
