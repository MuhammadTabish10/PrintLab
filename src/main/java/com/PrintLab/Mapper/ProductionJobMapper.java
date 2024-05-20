//package com.PrintLab.Mapper;
//
//import com.PrintLab.dto.ProductionJobDto;
//import com.PrintLab.exception.RecordNotFoundException;
//import com.PrintLab.model.ProductionJob;
//import com.PrintLab.repository.CustomerRepository;
//import org.springframework.stereotype.Component;
//
//import java.util.stream.Collectors;
//
//@Component
//public class ProductionJobMapper {
//
//    //    private final BusinessUnitProcessMapper businessUnitProcessMapper;
////    private final JobProcessedDetailsMapper detailMapper;
//    private final BusinessAndBranchMapper businessAndBranchMapper;
//    private final CustomerRepository customerRepository;
//
//    public ProductionJobMapper(
//            BusinessAndBranchMapper businessAndBranchMapper,
//            CustomerRepository customerRepository
//    ) {
//        this.businessAndBranchMapper = businessAndBranchMapper;
//        this.customerRepository = customerRepository;
//    }
//
//    public ProductionJobDto toProductionJobDto(ProductionJob productionJob) {
//        return ProductionJobDto.builder()
//                .id(productionJob.getId())
//                .client(customerRepository.findById(productionJob.getClient().getId())
//                        .orElseThrow(() -> new RecordNotFoundException("Customer not found")))
//                .businessCategory(productionJob.getBusinessCategory())
//                .productionUser(productionJob.getProductionUser())
//                .businessName(productionJob.getBusinesses().stream()
//                        .map(businessAndBranchMapper::toBusinessDto)
//                        .collect(Collectors.toList()))
////                .processList(productionJob.getProcessList().stream()
////                        .map(businessUnitProcessMapper::toProcessDto)
////                        .collect(Collectors.toList()))
//                .jobId(productionJob.getJobId())
//                .productCategory(productionJob.getProductCategory())
//                .productName(productionJob.getProductName())
//                .description(productionJob.getDescription())
//                .qty(productionJob.getQty())
//                .rate(productionJob.getRate())
//                .amount(productionJob.getAmount())
//                .linkedInvoice(productionJob.getLinkedInvoice())
//                .privateNotes(productionJob.getPrivateNotes())
//                .orderTrackingNotes(productionJob.getOrderTrackingNotes())
//                .productionNotes(productionJob.getProductionNotes())
//                .ctpFileName(productionJob.getCtpFileName())
//                .locationOfFile(productionJob.getLocationOfFile())
//                .sentOn(productionJob.getSentOn())
//                .designPackageFile(productionJob.getDesignPackageFile())
//                .locationOfDesignFile(productionJob.getLocationOfDesignFile())
//                .jobStartDate(productionJob.getJobStartDate())
//                .productionStartDate(productionJob.getProductionStartDate())
//                .productionEndDate(productionJob.getProductionEndDate())
//                .packingAndQADate(productionJob.getPackingAndQADate())
//                .deliveryDate(productionJob.getDeliveryDate())
//                .expiryDate(productionJob.getExpiryDate())
//                .sendTo(productionJob.getSendTo())
//                .sizeCategory(productionJob.getSizeCategory())
//                .size(productionJob.getSize())
//                .timeStamp(productionJob.getTimeStamp())
//                .assignedBy(productionJob.getAssignedBy())
//                .createdBy(productionJob.getCreatedBy())
//                .designer(productionJob.getDesigner())
//                .plateSetter(productionJob.getPlateSetter())
//                .production(productionJob.getProduction())
//                .status(productionJob.getStatus())
//                .type(productionJob.getType())
////                .proof(productionJob.getProof().stream()
////                        .map(proof -> {
////                            ProofDto proofDto = new ProofDto();
////                            proofDto.setId(proof.getId());
////                            proofDto.setFileData(proof.getFileData());
////                            return proofDto;
////                        })
////                        .collect(Collectors.toList()))
////                .processedDetailList(productionJob.getProcessedDetailList().stream()
////                        .map(detailMapper::toDto)
////                        .collect(Collectors.toList()))
//                .build();
//    }
//
//
//    public ProductionJob toProductionJobEntity(ProductionJobDto productionJobDto) {
//        // Create the ProductionJob object
//
//        // Create and set the Proof objects
////        List<Proof> proofs = productionJobDto.getProof().stream()
////                .map(proofDto -> {
////                    Proof proof = new Proof();
////                    proof.setId(proofDto.getId());
////                    proof.setFileData(proofDto.getFileData());
////                    proof.setProductionJob(productionJob); // Set the reference to the current ProductionJob
////                    return proof;
////                })
////                .collect(Collectors.toList());
////
////        productionJob.setProof(proofs);
//
//        return ProductionJob.builder()
//                .id(productionJobDto.getId())
//                .client(customerRepository.findById(productionJobDto.getClient().getId())
//                        .orElseThrow(() -> new RecordNotFoundException("Customer not found")))
//                .businessCategory(productionJobDto.getBusinessCategory())
//                .productionUser(productionJobDto.getProductionUser())
//                .businesses(productionJobDto.getBusinessName().stream()
//                        .map(businessAndBranchMapper::toBusinessEntity)
//                        .collect(Collectors.toList()))
////                .processList(productionJobDto.getProcessList().stream()
////                        .map(businessUnitProcessMapper::toProcessEntity)
////                        .collect(Collectors.toList()))
//                .jobId(productionJobDto.getJobId())
//                .productCategory(productionJobDto.getProductCategory())
//                .productName(productionJobDto.getProductName())
//                .description(productionJobDto.getDescription())
//                .qty(productionJobDto.getQty())
//                .rate(productionJobDto.getRate())
//                .amount(productionJobDto.getAmount())
//                .linkedInvoice(productionJobDto.getLinkedInvoice())
//                .privateNotes(productionJobDto.getPrivateNotes())
//                .orderTrackingNotes(productionJobDto.getOrderTrackingNotes())
//                .productionNotes(productionJobDto.getProductionNotes())
//                .ctpFileName(productionJobDto.getCtpFileName())
//                .locationOfFile(productionJobDto.getLocationOfFile())
//                .sentOn(productionJobDto.getSentOn())
//                .designPackageFile(productionJobDto.getDesignPackageFile())
//                .locationOfDesignFile(productionJobDto.getLocationOfDesignFile())
//                .jobStartDate(productionJobDto.getJobStartDate())
//                .productionStartDate(productionJobDto.getProductionStartDate())
//                .productionEndDate(productionJobDto.getProductionEndDate())
//                .packingAndQADate(productionJobDto.getPackingAndQADate())
//                .deliveryDate(productionJobDto.getDeliveryDate())
//                .expiryDate(productionJobDto.getExpiryDate())
//                .sizeCategory(productionJobDto.getSizeCategory())
//                .timeStamp(productionJobDto.getTimeStamp())
//                .type(productionJobDto.getType())
//                .assignedBy(productionJobDto.getAssignedBy())
//                .createdBy(productionJobDto.getCreatedBy())
//                .designer(productionJobDto.getDesigner())
//                .plateSetter(productionJobDto.getPlateSetter())
//                .production(productionJobDto.getProduction())
//                .size(productionJobDto.getSize())
//                .sendTo(productionJobDto.getSendTo())
//                .status(productionJobDto.getStatus())
////                .processedDetailList(productionJobDto.getProcessedDetailList().stream()
////                        .map(detailMapper::toEntity)
////                        .collect(Collectors.toList()))
//                .build();
//    }
//
//
//}
