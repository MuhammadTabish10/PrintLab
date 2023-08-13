package com.PrintLab.service;

import com.PrintLab.dto.ProductProcessDto;
import com.PrintLab.modal.ProductProcess;

import java.util.List;

public interface ProductProcessService
{
    ProductProcessDto save(ProductProcessDto productProcessDto);
    List<ProductProcessDto> getAll();
    ProductProcessDto findById(Long id);
    String deleteById(Long id);
    ProductProcessDto updateProductProcess(Long id, ProductProcess productProcess);
}
