package com.PrintLab.service.impl;

import com.PrintLab.Mapper.BusinessUnitCategoryMapper;
import com.PrintLab.dto.BusinessUnitCategoryDto;
import com.PrintLab.dto.BusinessUnitProcessDto;
import com.PrintLab.model.BusinessUnitCategory;
import com.PrintLab.model.BusinessUnitProcess;
import com.PrintLab.repository.BusinessUnitCategoryRepository;
import com.PrintLab.repository.BusinessUnitProcessRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.BusinessUnitCategoryService;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BusinessUnitCategoryImpl implements BusinessUnitCategoryService {

    private final BusinessUnitCategoryRepository categoryRepository;
    private final BusinessUnitProcessRepository processRepository;
    private final VendorRepository vendorRepository;
    private final BusinessUnitCategoryMapper categoryMapper;

    public BusinessUnitCategoryImpl(
            BusinessUnitCategoryRepository categoryRepository,
            BusinessUnitProcessRepository processRepository, VendorRepository vendorRepository, BusinessUnitCategoryMapper categoryMapper
    ) {
        this.categoryRepository = categoryRepository;
        this.processRepository = processRepository;
        this.vendorRepository = vendorRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public BusinessUnitCategoryDto createCategory(BusinessUnitCategoryDto categoryDto) {
        BusinessUnitCategory category = categoryMapper.toEntity(categoryDto);
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category already exists: " + category.getName());
        }
        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }


    @Override
    public List<BusinessUnitCategoryDto> getAllCategories() {
        List<BusinessUnitCategory> categories = categoryRepository.findAll();
        return categories.stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BusinessUnitCategoryDto getCategoryById(Long categoryId) {
        BusinessUnitCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        return categoryMapper.toDto(category);
    }

//    @Transactional
//    @Override
//    public BusinessUnitCategoryDto updateCategory(Long categoryId, BusinessUnitCategoryDto categoryDto) {
//        BusinessUnitCategory category = categoryMapper.toEntity(getCategoryById(categoryId));
//        updateCategoryFields(category, categoryDto);
//        updateProcesses(category, categoryDto.getProcessList());
//        return categoryMapper.toDto(category);
//    }
//
//
//    private void updateCategoryFields(BusinessUnitCategory category, BusinessUnitCategoryDto categoryDto) {
//        category.setName(categoryDto.getName());
//    }
//
//    private void updateProcesses(BusinessUnitCategory category, List<BusinessUnitProcessDto> processDtos) {
//        List<BusinessUnitProcess> updatedProcesses = new ArrayList<>();
//        for (BusinessUnitProcessDto processDto : processDtos) {
//            BusinessUnitProcess process = getOrCreateProcess(category, processDto);
//            updateProcessFields(process, processDto);
//            updateVendorsForProcess(process, processDto.getVendors());
//            updatedProcesses.add(process);
//        }
//        processRepository.saveAll(updatedProcesses);
//        category.setProcessList(updatedProcesses);
//    }
//
//    private void updateVendorsForProcess(BusinessUnitProcess process, List<VendorDto> vendorDtos) {
//        List<Vendor> updatedVendors = vendorDtos.stream()
//                .map(categoryMapper::toEntity)
//                .collect(Collectors.toList());
//        process.setVendors(updatedVendors);
//        for (Vendor vendor : updatedVendors) {
//            vendor.setBusinessUnitProcesses(Collections.singletonList(process));
//        }
//    }
//
//
//    private BusinessUnitProcess getOrCreateProcess(BusinessUnitCategory category, BusinessUnitProcessDto processDto) {
//        if (processDto.getId() != null) {
//            return category.getProcessList().stream()
//                    .filter(process -> process.getId().equals(processDto.getId()))
//                    .findFirst()
//                    .orElseThrow(() -> new EntityNotFoundException("Process not found with id: " + processDto.getId()));
//        } else {
//            return createNewProcess(category, processDto);
//        }
//    }
//
//    private BusinessUnitProcess createNewProcess(BusinessUnitCategory category, BusinessUnitProcessDto processDto) {
//        return BusinessUnitProcess.builder()
//                .process(processDto.getProcess())
//                .billable(processDto.isBillable())
//                .category(category)
//                .vendors(processDto.getVendors().stream()
//                        .map(categoryMapper::toEntity)
//                        .collect(Collectors.toList()))
//                .build();
//    }
//
//    private void updateProcessFields(BusinessUnitProcess process, BusinessUnitProcessDto processDto) {
//        process.setProcess(processDto.getProcess());
//        process.setBillable(processDto.isBillable());
//        process.setVendors(processDto.getVendors().stream()
//                .map(categoryMapper::toEntity)
//                .collect(Collectors.toList()));
//    }


//    @Transactional
//    @Override
//    public BusinessUnitCategoryDto updateCategory(Long categoryId, BusinessUnitCategoryDto categoryDto) {
//        Optional<BusinessUnitCategory> categoryOptional = categoryRepository.findById(categoryId);
//
//        if (categoryOptional.isPresent()) {
//            BusinessUnitCategory category = categoryOptional.get();
//            category.setName(categoryDto.getName());
//
//            // Update the processes
//            List<BusinessUnitProcessDto> processDtos = categoryDto.getProcessList();
//            List<BusinessUnitProcess> updatedProcesses = new ArrayList<>();
//            for (BusinessUnitProcessDto processDto : processDtos) {
//                BusinessUnitProcess process = null;
//                if (processDto.getId() != null) {
//                    // If the process exists, update it
//                    Optional<BusinessUnitProcess> existingProcessOptional = category.getProcessList()
//                            .stream()
//                            .filter(p -> p.getId().equals(processDto.getId()))
//                            .findFirst();
//                    if (existingProcessOptional.isPresent()) {
//                        process = existingProcessOptional.get();
//                        process.setProcess(processDto.getProcess());
//                        process.setBillable(processDto.isBillable());
//                        process.setVendors(processDto.getVendors().stream()
//                                .map(categoryMapper::toEntity)
//                                .collect(Collectors.toList()));
//                    }
//                } else {
//                    // If the process is new, create a new one
//                    process = BusinessUnitProcess.builder()
//                            .process(processDto.getProcess())
//                            .billable(processDto.isBillable())
//                            .category(category)
//                            .vendors(processDto.getVendors().stream()
//                                    .map(categoryMapper::toEntity)
//                                    .collect(Collectors.toList()))
//                            .build();
//                }
//                updatedProcesses.add(process);
//            }
//            // Update vendors associated with processes
//            for (BusinessUnitProcess updatedProcess : updatedProcesses) {
//                List<Vendor> vendors = updatedProcess.getVendors();
//                for (Vendor vendor : vendors) {
//                    vendor.setBusinessUnitProcesses(updatedProcesses);
//                }
//            }
//
//            // Save all updated processes (including vendors association)
//            List<BusinessUnitProcess> allUpdatedProcesses = processRepository.saveAll(updatedProcesses);
//            category.setProcessList(allUpdatedProcesses);
//
//            // Update the category
//            categoryRepository.save(category);
//
//            return categoryMapper.toDto(category);
//        } else {
//            throw new EntityNotFoundException("Category not found with id: " + categoryId);
//        }
//    }


    @Transactional
    @Override
    public BusinessUnitCategoryDto updateCategory(Long categoryId, BusinessUnitCategoryDto categoryDto) {
        Optional<BusinessUnitCategory> categoryOptional = categoryRepository.findById(categoryId);

        if (categoryOptional.isPresent()) {
            BusinessUnitCategory category = categoryOptional.get();
            category.setName(categoryDto.getName());
            List<BusinessUnitProcess> updatedProcesses = updateProcesses(category, categoryDto.getProcessList());
            category.setProcessList(updatedProcesses);
            categoryRepository.save(category);

            return categoryMapper.toDto(category);
        } else {
            throw new EntityNotFoundException("Category not found with id: " + categoryId);
        }
    }

    private List<BusinessUnitProcess> updateProcesses(BusinessUnitCategory category, List<BusinessUnitProcessDto> processDtos) {
        List<BusinessUnitProcess> updatedProcesses = new ArrayList<>();
        for (BusinessUnitProcessDto processDto : processDtos) {
            BusinessUnitProcess process = getOrCreateProcess(category, processDto);
            updateProcessFields(process, processDto);
            updatedProcesses.add(process);
        }
        return processRepository.saveAll(updatedProcesses);
    }

    private BusinessUnitProcess getOrCreateProcess(BusinessUnitCategory category, BusinessUnitProcessDto processDto) {
        if (processDto.getId() != null) {
            return category.getProcessList().stream()
                    .filter(process -> process.getId().equals(processDto.getId()))
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("Process not found with id: " + processDto.getId()));
        } else {
            return createNewProcess(category, processDto);
        }
    }

    private BusinessUnitProcess createNewProcess(BusinessUnitCategory category, BusinessUnitProcessDto processDto) {
        return BusinessUnitProcess.builder()
                .process(processDto.getProcess())
                .billable(processDto.isBillable())
                .category(category)
                .vendors(processDto.getVendors().stream()
                        .map(categoryMapper::toEntity)
                        .collect(Collectors.toList()))
                .build();
    }

    private void updateProcessFields(BusinessUnitProcess process, BusinessUnitProcessDto processDto) {
        process.setProcess(processDto.getProcess());
        process.setBillable(processDto.isBillable());
        process.setVendors(processDto.getVendors().stream()
                .map(categoryMapper::toEntity)
                .collect(Collectors.toList()));
    }


    @Override
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public void deleteProcess(Long processId) {
        processRepository.deleteById(processId);
    }

    @Override
    public Boolean getCategoryByName(String name) {
        return categoryRepository.existsByName(name);
    }

    @Override
    public List<BusinessUnitCategoryDto> getAllByName(String name) {
        List<BusinessUnitCategory> categories = categoryRepository.findAllByName(name);
        return categories.stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

}

