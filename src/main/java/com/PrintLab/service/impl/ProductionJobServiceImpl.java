package com.PrintLab.service.impl;

import com.PrintLab.Mapper.ProductionJobMapper;
import com.PrintLab.dto.BusinessDto;
import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.dto.ProductionJobDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.*;
import com.PrintLab.repository.BusinessRepository;
import com.PrintLab.repository.JobProcessedDetailsRepository;
import com.PrintLab.repository.ProductionJobRepository;
import com.PrintLab.repository.UserRepository;
import com.PrintLab.service.ProductionJobService;
import com.PrintLab.utils.EmailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductionJobServiceImpl implements ProductionJobService {

    private final ProductionJobRepository jobRepository;
    private final ProductionJobMapper mapper;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final EmailUtils emailUtils;
//    private final BusinessUnitProcessRepository businessUnitProcessRepository;

    private final JobProcessedDetailsRepository jobProcessedDetailsRepository;

    @Autowired
    public ProductionJobServiceImpl(ProductionJobRepository jobRepository, ProductionJobMapper mapper, BusinessRepository businessRepository, UserRepository userRepository, EmailUtils emailUtils, JobProcessedDetailsRepository jobProcessedDetailsRepository) {
        this.jobRepository = jobRepository;
        this.mapper = mapper;
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
        this.emailUtils = emailUtils;
//        this.businessUnitProcessRepository = businessUnitProcessRepository;
        this.jobProcessedDetailsRepository = jobProcessedDetailsRepository;
    }

    @Override
    public List<ProductionJobDto> getAllProductionJobs() {
        List<ProductionJob> productionJobs = jobRepository.findAll();
        return productionJobs.stream()
                .map(mapper::toProductionJobDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductionJobDto getProductionJobById(Long id) {
        Optional<ProductionJob> optionalProductionJob = jobRepository.findById(id);
        return optionalProductionJob.map(mapper::toProductionJobDto).orElse(null);
    }

    @Override
    public ProductionJobDto createProductionJob(ProductionJobDto productionJobDto, Long loggedInUserId) {
        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new RecordNotFoundException("User not found at id: " + loggedInUserId));
        ProductionJob productionJob = mapper.toProductionJobEntity(productionJobDto);
        productionJob.setStatus("New / Unassigned");
        productionJob.setCreatedBy(loggedInUser);
        ZonedDateTime zonedDateTime = ZonedDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
        LocalDateTime timeStampUtc = zonedDateTime.toLocalDateTime();
        productionJob.setTimeStamp(timeStampUtc);
        ProductionJob savedProductionJob = jobRepository.save(productionJob);
        return mapper.toProductionJobDto(savedProductionJob);
    }

    @Override
    @Transactional
    public ProductionJobDto updateProductionJob(Long id, ProductionJobDto productionJobDto) {
        Optional<ProductionJob> optionalProductionJob = jobRepository.findById(id);
        if (optionalProductionJob.isPresent()) {
            ProductionJob productionJob = optionalProductionJob.get();
            updateProductionJobFields(productionJob, productionJobDto);
            updateBusinesses(productionJob, productionJobDto);
//            updateProcessList(productionJob, productionJobDto);
            updateProcessedDetails(productionJob, productionJobDto);
//            updateProofs(productionJob, productionJobDto);

            productionJob.setSizeCategory(productionJobDto.getSizeCategory());
            productionJob.setSize(productionJobDto.getSize());
            productionJob.setTimeStamp(productionJobDto.getTimeStamp());
            productionJob.setCreatedBy(productionJobDto.getCreatedBy());
            productionJob.setStatus(productionJobDto.getStatus());
            productionJob.setCreatedBy(productionJobDto.getCreatedBy());

            ProductionJob updatedProductionJob = jobRepository.save(productionJob);
            return mapper.toProductionJobDto(updatedProductionJob);
        }
        return null;
    }

    private void updateProductionJobFields(ProductionJob productionJob, ProductionJobDto productionJobDto) {
        productionJob.setClient(productionJobDto.getClient());
        productionJob.setBusinessCategory(productionJobDto.getBusinessCategory());
        productionJob.setProductionUser(productionJobDto.getProductionUser());
        productionJob.setProductCategory(productionJobDto.getProductCategory());
        productionJob.setProductName(productionJobDto.getProductName());
        productionJob.setDescription(productionJobDto.getDescription());
        productionJob.setQty(productionJobDto.getQty());
        productionJob.setRate(productionJobDto.getRate());
        productionJob.setAmount(productionJobDto.getAmount());
        productionJob.setLinkedInvoice(productionJobDto.getLinkedInvoice());
        productionJob.setPrivateNotes(productionJobDto.getPrivateNotes());
        productionJob.setOrderTrackingNotes(productionJobDto.getOrderTrackingNotes());
        productionJob.setProductionNotes(productionJobDto.getProductionNotes());
        productionJob.setCtpFileName(productionJobDto.getCtpFileName());
        productionJob.setLocationOfFile(productionJobDto.getLocationOfFile());
        productionJob.setSentOn(productionJobDto.getSentOn());
        productionJob.setDesignPackageFile(productionJobDto.getDesignPackageFile());
        productionJob.setLocationOfDesignFile(productionJobDto.getLocationOfDesignFile());
        productionJob.setJobStartDate(productionJobDto.getJobStartDate());
        productionJob.setProductionStartDate(productionJobDto.getProductionStartDate());
        productionJob.setProductionEndDate(productionJobDto.getProductionEndDate());
        productionJob.setPackingAndQADate(productionJobDto.getPackingAndQADate());
        productionJob.setDeliveryDate(productionJobDto.getDeliveryDate());
        productionJob.setExpiryDate(productionJobDto.getExpiryDate());
        productionJob.setSendTo(productionJobDto.getSendTo());
    }

    private void updateBusinesses(ProductionJob productionJob, ProductionJobDto productionJobDto) {
        if (productionJobDto.getBusinessName() != null) {
            List<Business> updatedBusinesses = new ArrayList<>();
            for (BusinessDto businessDto : productionJobDto.getBusinessName()) {
                Business business = businessRepository.findById(businessDto.getId()).orElse(null);
                if (business != null) {
                    updatedBusinesses.add(business);
                }
            }
            productionJob.setBusinesses(updatedBusinesses);
        }
    }

//    private void updateProcessList(ProductionJob productionJob, ProductionJobDto productionJobDto) {
//        if (productionJobDto.getProcessList() != null) {
//            List<BusinessUnitProcess> updatedProcessList = new ArrayList<>();
//            for (BusinessUnitProcessDto processDto : productionJobDto.getProcessList()) {
//                BusinessUnitProcess process = businessUnitProcessRepository.findById(processDto.getId()).orElse(null);
//                if (process != null) {
//                    updatedProcessList.add(process);
//                }
//            }
//            productionJob.setProcessList(updatedProcessList);
//        }
//    }

    private void updateProcessedDetails(ProductionJob productionJob, ProductionJobDto productionJobDto) {
        if (productionJobDto.getProcessedDetailList() != null) {
            List<JobProcessedDetails> updatedProcessedDetails = new ArrayList<>();
            for (JobProcessedDetailsDto processedDetailsDto : productionJobDto.getProcessedDetailList()) {
                JobProcessedDetails processedDetails;
                if (processedDetailsDto.getId() != null) {
                    // If the id is present, try to find the existing entity and update it
                    processedDetails = jobProcessedDetailsRepository.findById(processedDetailsDto.getId()).orElse(null);
                } else {
                    // If the id is null, create a new entity
                    processedDetails = new JobProcessedDetails();
                    // Set the productionJobId reference
                    processedDetails.setProductionJob(productionJob);
                }
                // Update the entity with data from the DTO
                if (processedDetails != null) {
                    // Check if each property in the DTO is not null before setting it in the entity
                    processedDetails.setAmount(processedDetailsDto.getAmount());
                    processedDetails.setVendor(processedDetailsDto.getVendor());
                    processedDetails.setPayment(processedDetailsDto.getPayment());
                    // Assuming these properties are boolean, you can directly set them
                    processedDetails.setStatus(processedDetailsDto.isStatus());
                    processedDetails.setJobProcessed(processedDetailsDto.isJobProcessed());
                    processedDetails.setProcessName(processedDetailsDto.getProcessName());
                    processedDetails.setTimeStamp(processedDetailsDto.getTimeStamp());
                    // Add the updated or new entity to the list
                    updatedProcessedDetails.add(processedDetails);
                }
            }
            // Set the list of updated or new entities to the production job
            productionJob.setProcessedDetailList(updatedProcessedDetails);
        }
    }


//    private void updateProofs(ProductionJob productionJob, ProductionJobDto productionJobDto) {
//        if (productionJobDto.getProof() != null) {
//            List<Proof> updatedProofs = new ArrayList<>();
//            for (ProofDto proofDto : productionJobDto.getProof()) {
//                Proof proof = Proof.builder()
//                        .id(proofDto.getId())
//                        .fileData(proofDto.getFileData())
//                        .productionJob(productionJob)
//                        .build();
//                updatedProofs.add(proof);
//            }
//            productionJob.setProof(updatedProofs);
//        }
//    }
    @Override
    public void deleteProductionJob(Long id) {
        jobRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ProductionJobDto assignOrderToUser(Long orderId, Long userId, String role, Long loggedInUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RecordNotFoundException("User not found at id: " + userId));
        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new RecordNotFoundException("User not found at id: " + loggedInUserId));

        ProductionJob productionJob = jobRepository.findById(orderId)
                .orElseThrow(() -> new RecordNotFoundException("Order not found at id: " + orderId));

        if (role.equalsIgnoreCase("ROLE_PRODUCTION")) {
            productionJob.setProduction(user);
            emailUtils.sendOrderAssignedEmail(user.getEmail(), productionJob);
        } else if (role.equalsIgnoreCase("ROLE_DESIGNER")) {
            productionJob.setDesigner(user);
            emailUtils.sendOrderAssignedEmail(user.getEmail(), productionJob);
        } else if (role.equalsIgnoreCase("ROLE_PLATE_SETTER")) {
            productionJob.setPlateSetter(user);
            emailUtils.sendOrderAssignedEmail(user.getEmail(), productionJob);
        }
        ZonedDateTime zonedDateTime = ZonedDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
        LocalDateTime timeStampUtc = zonedDateTime.toLocalDateTime();
        productionJob.setTimeStamp(timeStampUtc);
        productionJob.setStatus("Connected");
        productionJob.setAssignedBy(loggedInUser);
        jobRepository.save(productionJob);
        return mapper.toProductionJobDto(productionJob);
    }
}
