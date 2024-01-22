package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductAndServiceDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.ProductAndService;
import com.PrintLab.repository.ProductAndServiceRepository;
import com.PrintLab.repository.ProductCategoryRepository;
import com.PrintLab.service.ProductAndServiceService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductAndServiceImpl implements ProductAndServiceService {

    private final ProductAndServiceRepository productAndServiceRepository;
    private final ProductCategoryRepository productCategoryRepository;

    public ProductAndServiceImpl(ProductAndServiceRepository productAndServiceRepository, ProductCategoryRepository productCategoryRepository) {
        this.productAndServiceRepository = productAndServiceRepository;
        this.productCategoryRepository = productCategoryRepository;
    }

//    @Override
//    @Transactional
//    public ProductAndServiceDto save(ProductAndServiceDto productAndServiceDto) {
//        ProductAndService productAndService = toEntity(productAndServiceDto);
//        productAndService.setStatus(true);
//        return toDto(productAndServiceRepository.save(productAndService));
//    }

    @Override
    @Transactional
    public ProductAndServiceDto save(ProductAndServiceDto productAndServiceDto) {
        ProductAndService productAndService = toEntity(productAndServiceDto);
        productAndService.setStatus(true);

        productAndService.setProductCategory(
                productAndServiceDto.getProductCategory() != null && productAndServiceDto.getProductCategory().getId() == null
                        ? productCategoryRepository.save(productAndServiceDto.getProductCategory())
                        : productAndServiceDto.getProductCategory()
        );

        return toDto(productAndServiceRepository.save(productAndService));
    }



    @Override
    public List<ProductAndServiceDto> getAll() {
        List<ProductAndService> productAndServiceList = productAndServiceRepository.findAllByStatusIsTrue();
        List<ProductAndServiceDto> productAndServiceDtoList = new ArrayList<>();

        for (ProductAndService productAndService : productAndServiceList) {
            ProductAndServiceDto productAndServiceDto = toDto(productAndService);
            productAndServiceDtoList.add(productAndServiceDto);
        }
        return productAndServiceDtoList;
    }

    @Override
    public ProductAndServiceDto findById(Long id) {
        Optional<ProductAndService> optionalProductAndService = productAndServiceRepository.findById(id);

        if (optionalProductAndService.isPresent()) {
            ProductAndService productAndService = optionalProductAndService.get();
            return toDto(productAndService);
        } else {
            throw new RecordNotFoundException(String.format("Product and Service not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public String deleteById(Long id) {
        Optional<ProductAndService> optionalProductAndService = productAndServiceRepository.findById(id);

        if (optionalProductAndService.isPresent()) {
            ProductAndService productAndService = optionalProductAndService.get();
            productAndServiceRepository.setStatusInactive(id);
        } else {
            throw new RecordNotFoundException(String.format("Product and Service not found for id => %d", id));
        }
        return null;
    }

    @Override
    @Transactional
    public ProductAndServiceDto updateProductAndService(Long id, ProductAndServiceDto productAndServiceDto) {
        Optional<ProductAndService> optionalProductAndService = productAndServiceRepository.findById(id);
        if (optionalProductAndService.isPresent()) {
            ProductAndService existingProductAndService = optionalProductAndService.get();
            existingProductAndService.setName(productAndServiceDto.getName());
            existingProductAndService.setStatus(productAndServiceDto.getStatus());
            existingProductAndService.setDescription(productAndServiceDto.getDescription());
            existingProductAndService.setType(productAndServiceDto.getType());
            existingProductAndService.setCost(productAndServiceDto.getCost());
            existingProductAndService.setProductCategory(productAndServiceDto.getProductCategory());

            ProductAndService updatedProductAndService = productAndServiceRepository.save(existingProductAndService);
            return toDto(updatedProductAndService);
        } else {
            throw new RecordNotFoundException(String.format("Product and Service not found for id => %d", id));
        }
    }

    public ProductAndServiceDto toDto(ProductAndService productAndService) {
        return ProductAndServiceDto.builder()
                .id(productAndService.getId())
                .name(productAndService.getName())
                .status(productAndService.getStatus())
                .description(productAndService.getDescription())
                .type(productAndService.getType())
                .cost(productAndService.getCost())
                .productCategory(productAndService.getProductCategory())
                .build();
    }

    public ProductAndService toEntity(ProductAndServiceDto productAndServiceDto) {
        return ProductAndService.builder()
                .id(productAndServiceDto.getId())
                .name(productAndServiceDto.getName())
                .status(productAndServiceDto.getStatus())
                .description(productAndServiceDto.getDescription())
                .type(productAndServiceDto.getType())
                .cost(productAndServiceDto.getCost())
                .productCategory(productAndServiceDto.getProductCategory())
                .build();
    }
}
