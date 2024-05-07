package com.PrintLab.service.impl;

import com.PrintLab.Mapper.ProductRuleJobMapper;
import com.PrintLab.dto.BusinessUnitProcessDto;
import com.PrintLab.dto.ProductRuleJobDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.BusinessUnitProcess;
import com.PrintLab.model.ProductRuleJob;
import com.PrintLab.repository.BusinessUnitProcessRepository;
import com.PrintLab.repository.ProductRuleJobRepository;
import com.PrintLab.service.ProductRuleJobService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductRuleJobServiceImpl implements ProductRuleJobService {

    private final ProductRuleJobRepository productRuleJobRepository;
    //    private final JobSizeRepository jobSizeRepository;
//    private final JobSizeMapper jobSizeMapper;
    private final ProductRuleJobMapper productRuleJobMapper;
    //    private final EntityManager entityManager;
    private final BusinessUnitProcessRepository businessUnitProcessRepository;

    public ProductRuleJobServiceImpl
            (
                    ProductRuleJobRepository productRuleJobRepository,
                    ProductRuleJobMapper productRuleJobMapper,
                    BusinessUnitProcessRepository businessUnitProcessRepository
            ) {
        this.productRuleJobRepository = productRuleJobRepository;
        this.productRuleJobMapper = productRuleJobMapper;
        this.businessUnitProcessRepository = businessUnitProcessRepository;
    }


    @Override
    public List<ProductRuleJobDto> findAll() {
        List<ProductRuleJob> productRuleJobs = productRuleJobRepository.findAll();
        return productRuleJobs.stream()
                .map(productRuleJobMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductRuleJobDto getById(Long id) {
        Optional<ProductRuleJob> productRuleJobOptional = productRuleJobRepository.findById(id);
        if (productRuleJobOptional.isPresent()) {
            return productRuleJobMapper.toDto(productRuleJobOptional.get());
        } else {
            throw new RecordNotFoundException("ProductRuleJob not found with id: " + id);
        }
    }

    @Override
    @Transactional
    public ProductRuleJobDto save(ProductRuleJobDto productRuleJobDto) {
        ProductRuleJob productRuleJob = productRuleJobMapper.toEntity(productRuleJobDto);
        productRuleJob = productRuleJobRepository.save(productRuleJob);
        return productRuleJobMapper.toDto(productRuleJob);
    }


    @Override
    @Transactional
    public ProductRuleJobDto update(Long id, ProductRuleJobDto productRuleJobDto) {
        Optional<ProductRuleJob> productRuleJobOptional = productRuleJobRepository.findById(id);
        if (productRuleJobOptional.isPresent()) {
            ProductRuleJob productRuleJob = productRuleJobOptional.get();
            productRuleJob.setProductName(productRuleJobDto.getProductName());
            productRuleJob.setCategory(productRuleJobDto.getCategory());
            productRuleJob.setSizeCategory(productRuleJobDto.getSizeCategory());
            productRuleJob.setSize(productRuleJobDto.getSize());
            updateProcessList(productRuleJob, productRuleJobDto);
            ProductRuleJob updatedProductRuleJob = productRuleJobRepository.save(productRuleJob);
            return productRuleJobMapper.toDto(updatedProductRuleJob);
        } else {
            throw new RecordNotFoundException("ProductRuleJob not found with id: " + id);
        }
    }

    private void updateProcessList(ProductRuleJob productRuleJob, ProductRuleJobDto productRuleJobDto) {
        if (productRuleJobDto.getProcessList() != null) {
            Set<Long> newProcessIds = productRuleJobDto.getProcessList().stream()
                    .map(BusinessUnitProcessDto::getId)
                    .collect(Collectors.toSet());

            // Remove BusinessUnitProcess entities that are not present in the updated DTO
            productRuleJob.getProcessList().removeIf(process -> !newProcessIds.contains(process.getId()));

            // Add new BusinessUnitProcess entities
            for (BusinessUnitProcessDto processDto : productRuleJobDto.getProcessList()) {
                BusinessUnitProcess process = productRuleJob.getProcessList().stream()
                        .filter(p -> p.getId().equals(processDto.getId()))
                        .findFirst()
                        .orElse(null);

                if (process == null) {
                    // Fetch the BusinessUnitProcess entity from the database and add it to the list
                    process = businessUnitProcessRepository.findById(processDto.getId())
                            .orElseThrow(() -> new RecordNotFoundException("BusinessUnitProcess not found with id: " + processDto.getId()));
                    productRuleJob.getProcessList().add(process);
                }
            }
        }
    }


//    private void updateSizeList(ProductRuleJob productRuleJob, ProductRuleJobDto productRuleJobDto) {
//        if (productRuleJobDto.getSizeList() != null) {
//            Set<Long> newSizeIds = productRuleJobDto.getSizeList().stream()
//                    .map(JobSizeDto::getId)
//                    .collect(Collectors.toSet());
//
//            // Remove JobSize entities that are not present in the updated DTO and delete them from the database
//            Iterator<JobSize> sizeIterator = productRuleJob.getSizeList().iterator();
//            while (sizeIterator.hasNext()) {
//                JobSize size = sizeIterator.next();
//                if (!newSizeIds.contains(size.getId())) {
//                    // Detach the entity from the persistence context
//                    entityManager.detach(size);
//                    // Delete the JobSize entity from the database
//                    jobSizeRepository.delete(size);
//                    // Remove the JobSize entity from the list
//                    sizeIterator.remove();
//                }
//            }
//
//            // Update existing JobSize entities
//            for (JobSize size : productRuleJob.getSizeList()) {
//                JobSizeDto matchingDto = productRuleJobDto.getSizeList().stream()
//                        .filter(dto -> dto.getId().equals(size.getId()))
//                        .findFirst()
//                        .orElse(null);
//                if (matchingDto != null) {
//                    // Update the existing JobSize entity
//                    size.setName(matchingDto.getName());
//                }
//            }
//
//            // Add new JobSize entities
//            for (JobSizeDto sizeDto : productRuleJobDto.getSizeList()) {
//                if (sizeDto.getId() == null) {
//                    // If the ID is null, it means it's a new JobSize entity
//                    JobSize newSize = jobSizeMapper.toEntity(sizeDto);
//                    newSize.setProductRuleJob(productRuleJob);
//                    productRuleJob.getSizeList().add(newSize);
//                }
//            }
//        }
//    }


    @Override
    @Transactional
    public void delete(Long id) {
        Optional<ProductRuleJob> productRuleJobOptional = productRuleJobRepository.findById(id);
        if (productRuleJobOptional.isPresent()) {
            productRuleJobRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException("ProductRuleJob not found with id: " + id);
        }
    }

    @Override
    public Boolean checkTitle(String productName) {
        return (productRuleJobRepository.existsByProductName(productName));
    }
}
