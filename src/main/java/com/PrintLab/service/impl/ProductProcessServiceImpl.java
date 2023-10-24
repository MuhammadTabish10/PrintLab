package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductProcessDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.ProductProcess;
import com.PrintLab.repository.ProductProcessRepository;
import com.PrintLab.service.ProductProcessService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductProcessServiceImpl implements ProductProcessService
{
    private final ProductProcessRepository productProcessRepository;

    public ProductProcessServiceImpl(ProductProcessRepository productProcessRepository) {
        this.productProcessRepository = productProcessRepository;
    }

    @Override
    @Transactional
    public ProductProcessDto save(ProductProcessDto productProcessDto) {
        ProductProcess productProcess = productProcessRepository.save(toEntity(productProcessDto));
        return toDto(productProcess);
    }

    @Override
    public List<ProductProcessDto> getAll() {
        List<ProductProcess> productProcessesList = productProcessRepository.findByStatus("Active");
        List<ProductProcessDto> productProcessDtoList = new ArrayList<>();

        for (ProductProcess productProcess : productProcessesList) {
            ProductProcessDto productProcessDto = toDto(productProcess);
            productProcessDtoList.add(productProcessDto);
        }
        return productProcessDtoList;
    }

    @Override
    public ProductProcessDto findById(Long id){
        Optional<ProductProcess> optionalProductProcess = productProcessRepository.findById(id);

        if(optionalProductProcess.isPresent()) {
            ProductProcess productProcess = optionalProductProcess.get();
            return toDto(productProcess);
        }
        else {
            throw new RecordNotFoundException(String.format("Product Process not found for id => %d", id));
        }
    }

    @Override
    public ProductProcessDto findByName(String name) {
        Optional<ProductProcess> productProcessOptional = Optional.ofNullable(productProcessRepository.findByName(name));

        if(productProcessOptional.isPresent()){
            ProductProcess productProcess = productProcessOptional.get();
            return toDto(productProcess);
        }
        else {
            throw new RecordNotFoundException(String.format("ProductProcess not found at => %s", name));
        }
    }

    @Override
    public List<ProductProcessDto> searchByName(String name) {
        List<ProductProcess> productProcessList = productProcessRepository.findProductProcessByName(name);
        List<ProductProcessDto> productProcessDtoList = new ArrayList<>();

        for (ProductProcess productProcess : productProcessList) {
            ProductProcessDto productProcessDto = toDto(productProcess);
            productProcessDtoList.add(productProcessDto);
        }
        return productProcessDtoList;
    }

    @Override
    @Transactional
    public String deleteById(Long id) {
        Optional<ProductProcess> optionalProductProcess = productProcessRepository.findById(id);

        if(optionalProductProcess.isPresent()) {
            ProductProcess productProcess = optionalProductProcess.get();
            productProcessRepository.setStatusInactive(id);
        }
        else{
            throw new RecordNotFoundException(String.format("Product Process not found for id => %d", id));
        }
        return null;
    }

    @Override
    @Transactional
    public ProductProcessDto updateProductProcess(Long id, ProductProcess productProcess) {
        Optional<ProductProcess> optionalProductProcess = productProcessRepository.findById(id);
        if(optionalProductProcess.isPresent()){
            ProductProcess existingProductProcess = optionalProductProcess.get();
            existingProductProcess.setName(productProcess.getName());
            existingProductProcess.setStatus(productProcess.getStatus());


            ProductProcess updatedProductProcess = productProcessRepository.save(existingProductProcess);
            return toDto(updatedProductProcess);
        }
        else {
            throw new RecordNotFoundException(String.format("Product Process not found for id => %d", id));
        }
    }

    public ProductProcessDto toDto(ProductProcess productProcess) {
        return ProductProcessDto.builder()
                .id(productProcess.getId())
                .name(productProcess.getName())
                .status(productProcess.getStatus())
                .build();
    }

    public ProductProcess toEntity(ProductProcessDto productProcessDto) {
        return ProductProcess.builder()
                .id(productProcessDto.getId())
                .name(productProcessDto.getName())
                .status(productProcessDto.getStatus())
                .build();
    }
}
