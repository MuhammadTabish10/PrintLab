package com.PrintLab.service;

import com.PrintLab.dto.ProductionJobDto;

import java.util.List;

public interface ProductionJobService {
    List<ProductionJobDto> getAllProductionJobs();

    ProductionJobDto getProductionJobById(Long id);

    ProductionJobDto createProductionJob(ProductionJobDto productionJobDto);

    ProductionJobDto updateProductionJob(Long id, ProductionJobDto productionJobDto);

    void deleteProductionJob(Long id);
}
