package com.PrintLab.service.impl;

import com.PrintLab.Mapper.ProductRuleMapper;
import com.PrintLab.dto.*;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.*;
import com.PrintLab.model.Order;
import com.PrintLab.repository.*;
import com.PrintLab.service.ProductRuleService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductRuleServiceImpl implements ProductRuleService {
    private static final String DOUBLE_SIDED = "DOUBLE_SIDED";
    private static final String SINGLE_SIDED = "SINGLE_SIDED";
    private final ProductRuleRepository productRuleRepository;
    private final VendorRepository vendorRepository;
    private final ProductRulePaperStockRepository productRulePaperStockRepository;
    private final ProductRuleMapper productRuleMapper;
    private final BusinessUnitProcessRepository businessUnitProcessRepository;
    private final JobProcessedDetailsRepository jobProcessedDetailsRepository;
    private final EntityManager entityManager;

    public ProductRuleServiceImpl(EntityManager entityManager, ProductRuleRepository productRuleRepository, VendorRepository vendorRepository, ProductRulePaperStockRepository productRulePaperStockRepository, ProductRuleMapper productRuleMapper, BusinessUnitProcessRepository businessUnitProcessRepository, JobProcessedDetailsRepository jobProcessedDetailsRepository) {
        this.productRuleRepository = productRuleRepository;
        this.vendorRepository = vendorRepository;
        this.productRulePaperStockRepository = productRulePaperStockRepository;
        this.productRuleMapper = productRuleMapper;
        this.businessUnitProcessRepository = businessUnitProcessRepository;
        this.jobProcessedDetailsRepository = jobProcessedDetailsRepository;
        this.entityManager = entityManager;
    }

    @Transactional
    @Override
    public ProductRuleDto save(ProductRuleDto productRuleDto) {
        List<ProductRulePaperStockDto> productRulePaperStockList = productRuleDto.getProductRulePaperStockList();

        if (productRulePaperStockList != null && !productRulePaperStockList.isEmpty()) {
            return saveProductRuleWithPaperStock(productRuleDto);
        } else {
            return saveProductRuleWithoutPaperStock(productRuleDto);
        }
    }

    private ProductRuleDto saveProductRuleWithPaperStock(ProductRuleDto productRuleDto) {
        ProductRule productRule = productRuleMapper.toEntity(productRuleDto);
        if (productRule.getPrintSide().equals(SINGLE_SIDED)) {
            productRule.setImpositionValue(false);
        }
        ProductRule createdProductRule = productRuleRepository.save(productRule);

        List<ProductRulePaperStock> productRulePaperStockList = productRule.getProductRulePaperStockList();
        if (productRulePaperStockList != null && !productRulePaperStockList.isEmpty()) {
            for (ProductRulePaperStock productRulePaperStock : productRulePaperStockList) {
                productRulePaperStock.setProductRule(createdProductRule);
                productRulePaperStock.setVendor(vendorRepository.findById(productRulePaperStock.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found for id => %d", productRulePaperStock.getProductRule().getId()))));
                productRulePaperStock.setStatus(true);
                productRulePaperStockRepository.save(productRulePaperStock);
            }
            createdProductRule.setProductRulePaperStockList(productRulePaperStockList);
            productRuleRepository.save(createdProductRule);
        }

        return productRuleMapper.toDto(createdProductRule);
    }

    private ProductRuleDto saveProductRuleWithoutPaperStock(ProductRuleDto productRuleDto) {
        ProductRule productRule = productRuleMapper.toEntity(productRuleDto);
        productRule = productRuleRepository.save(productRule);
        return productRuleMapper.toDto(productRule);
    }

    @Override
    public Boolean checkTitle(String productName) {
        return(productRuleRepository.existsByProductNameAndStatusIsTrue(productName));
    }

    @Override
    public List<ProductRuleDto> getAllProductRule() {
        List<ProductRule> productRuleList = productRuleRepository.findByStatus("Active");
        List<ProductRuleDto> productRuleDtoList = new ArrayList<>();

        for (ProductRule productRule : productRuleList) {
            ProductRuleDto productRuleDto = productRuleMapper.toDto(productRule);
            productRuleDtoList.add(productRuleDto);
        }
        return productRuleDtoList;
    }

    @Override
    public List<ProductRuleDto> searchByName(String productName) {
        List<ProductRule> productRuleList = productRuleRepository.findProductRuleByProductName(productName);
        List<ProductRuleDto> productRuleDtoList = new ArrayList<>();

        for (ProductRule productRule : productRuleList) {
            ProductRuleDto productRuleDto = productRuleMapper.toDto(productRule);
            productRuleDtoList.add(productRuleDto);
        }
        return productRuleDtoList;
    }

    @Override
    public ProductRuleDto getProductRuleById(Long id) {
        Optional<ProductRule> optionalProductRule = productRuleRepository.findById(id);

        if (optionalProductRule.isPresent()) {
            ProductRule productRule = optionalProductRule.get();
            return productRuleMapper.toDto(productRule);
        } else {
            throw new RecordNotFoundException(String.format("ProductRule not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public ProductRuleDto update(Long id, ProductRuleDto productRuleDto) {
        Optional<ProductRule> optionalProductRule = productRuleRepository.findById(id);
        if (optionalProductRule.isPresent()) {
            ProductRule existingProductRule = optionalProductRule.get();

            // Update fields common to both ProductRule and ProductRuleDto
            updateProductRuleFields(existingProductRule, productRuleDto);

            // Update ProcessList and ProcessedDetails
            updateProcessListAndDetails(existingProductRule, productRuleDto);

            // Update ProductRulePaperStock entities
            updateProductRulePaperStocks(existingProductRule, productRuleDto.getProductRulePaperStockList());

            // Save the updated ProductRule
            ProductRule updatedProductRule = productRuleRepository.save(existingProductRule);
            return productRuleMapper.toDto(updatedProductRule);
        } else {
            throw new RecordNotFoundException("ProductRule not found with id: " + id);
        }
    }

    private void updateProductRuleFields(ProductRule existingProductRule, ProductRuleDto productRuleDto) {
        existingProductRule.setProductName(productRuleDto.getProductName());
        existingProductRule.setBusinessCategory(productRuleDto.getBusinessCategory());
        existingProductRule.setSizeCategory(productRuleDto.getSizeCategory());
        existingProductRule.setSize(productRuleDto.getSize());
    }

    private void updateProcessListAndDetails(ProductRule existingProductRule, ProductRuleDto productRuleDto) {
        // Update ProcessList
        if (productRuleDto.getProcessList() != null) {
            Set<Long> newProcessIds = productRuleDto.getProcessList().stream()
                    .map(BusinessUnitProcessDto::getId)
                    .collect(Collectors.toSet());

            existingProductRule.getProcessList().removeIf(process -> !newProcessIds.contains(process.getId()));

            for (BusinessUnitProcessDto processDto : productRuleDto.getProcessList()) {
                BusinessUnitProcess process = existingProductRule.getProcessList().stream()
                        .filter(p -> p.getId().equals(processDto.getId()))
                        .findFirst()
                        .orElseGet(() -> businessUnitProcessRepository.findById(processDto.getId())
                                .orElseThrow(() -> new RecordNotFoundException("BusinessUnitProcess not found with id: " + processDto.getId())));

                if (!existingProductRule.getProcessList().contains(process)) {
                    existingProductRule.getProcessList().add(process);
                }
            }
        }

        // Update ProcessedDetails
        if (productRuleDto.getProcessedDetailList() != null) {
            List<JobProcessedDetails> updatedProcessedDetails = new ArrayList<>();
            for (JobProcessedDetailsDto processedDetailsDto : productRuleDto.getProcessedDetailList()) {
                JobProcessedDetails processedDetails;
                if (processedDetailsDto.getId() != null) {
                    processedDetails = jobProcessedDetailsRepository.findById(processedDetailsDto.getId())
                            .orElse(null);
                } else {
                    processedDetails = new JobProcessedDetails();
                    processedDetails.setProductRule(existingProductRule);
                }

                if (processedDetails != null) {
                    processedDetails.setAmount(processedDetailsDto.getAmount());
                    processedDetails.setVendor(processedDetailsDto.getVendor());
                    processedDetails.setPayment(processedDetailsDto.getPayment());
                    processedDetails.setStatus(processedDetailsDto.isStatus());
                    processedDetails.setJobProcessed(processedDetailsDto.isJobProcessed());
                    processedDetails.setProcessName(processedDetailsDto.getProcessName());
                    processedDetails.setTimeStamp(processedDetailsDto.getTimeStamp());
                    updatedProcessedDetails.add(processedDetails);
                }
            }
            existingProductRule.setProcessedDetailList(updatedProcessedDetails);
        }
    }

    private void updateProductRulePaperStocks(ProductRule existingProductRule, List<ProductRulePaperStockDto> updatedPaperStocks) {
        List<ProductRulePaperStock> existingPaperStocks = existingProductRule.getProductRulePaperStockList();

        // Remove PaperStock entities that are not present in the updated DTO
        existingPaperStocks.removeIf(existing -> updatedPaperStocks.stream().noneMatch(updated -> updated.getId().equals(existing.getId())));

        // Update or add new PaperStock entities
        for (ProductRulePaperStockDto updatedPaperStock : updatedPaperStocks) {
            Optional<ProductRulePaperStock> existingOptional = existingPaperStocks.stream()
                    .filter(existing -> existing.getId().equals(updatedPaperStock.getId()))
                    .findFirst();

            if (existingOptional.isPresent()) {
                // Update existing PaperStock entity
                ProductRulePaperStock existing = existingOptional.get();
                existing.setPaperStock(updatedPaperStock.getPaperStock());
                existing.setCustomerFriendlyName(updatedPaperStock.getCustomerFriendlyName());
                existing.setBrand(updatedPaperStock.getBrand());
                existing.setMadeIn(updatedPaperStock.getMadeIn());
                existing.setDimension(updatedPaperStock.getDimension());
                existing.setGsm(updatedPaperStock.getGsm());
                existing.setVendor(vendorRepository.findById(updatedPaperStock.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found for id => %d", updatedPaperStock.getId()))));
            } else {
                // Add new PaperStock entity
                ProductRulePaperStock newPaperStock = new ProductRulePaperStock();
                newPaperStock.setProductRule(existingProductRule);
                newPaperStock.setPaperStock(updatedPaperStock.getPaperStock());
                newPaperStock.setCustomerFriendlyName(updatedPaperStock.getCustomerFriendlyName());
                newPaperStock.setBrand(updatedPaperStock.getBrand());
                newPaperStock.setMadeIn(updatedPaperStock.getMadeIn());
                newPaperStock.setDimension(updatedPaperStock.getDimension());
                newPaperStock.setGsm(updatedPaperStock.getGsm());
                newPaperStock.setVendor(vendorRepository.findById(updatedPaperStock.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found for id => %d", updatedPaperStock.getId()))));
                existingPaperStocks.add(newPaperStock);
            }
        }
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Optional<ProductRule> optionalProductRule = productRuleRepository.findById(id);

        if (optionalProductRule.isPresent()) {
            productRuleRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException(String.format("ProductRule not found for id => %d", id));
        }
    }

    @Override
    public PaginationResponse getAllPaginatedProductRule(Integer pageNumber, Integer pageSize, ProductRuleDto searchCriteria) {
        Pageable page = PageRequest.of(pageNumber, pageSize);
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProductRule> cq = criteriaBuilder.createQuery(ProductRule.class);
        Root<ProductRule> leadsRoot = cq.from(ProductRule.class);

        List<Predicate> predicates = buildPredicates(criteriaBuilder, leadsRoot, searchCriteria);
        cq.where(predicates.toArray(new Predicate[0]));
        cq.orderBy(criteriaBuilder.desc(leadsRoot.get("id")));

        TypedQuery<ProductRule> query = entityManager.createQuery(cq);
        applyPagination(query, pageNumber, pageSize);

        List<ProductRule> resultList = query.getResultList();
        Long totalElements = countTotalElements(criteriaBuilder, searchCriteria);
        List<ProductRuleDto> dtoList = mapToDto(resultList);

        return createPaginationResponse(dtoList, pageNumber, pageSize, totalElements);
    }

    private void applyPagination(TypedQuery<?> query, Integer pageNumber, Integer pageSize) {
        int firstResult = pageNumber * pageSize;
        query.setFirstResult(firstResult);
        query.setMaxResults(pageSize);
    }

    private PaginationResponse createPaginationResponse(List<ProductRuleDto> dtoList, Integer pageNumber, Integer pageSize, Long totalElements) {
        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setContent(dtoList);
        paginationResponse.setPageNumber(pageNumber);
        paginationResponse.setPageSize(pageSize);
        paginationResponse.setTotalElements(totalElements.intValue());
        paginationResponse.setTotalPages((int) Math.ceil((double) totalElements / pageSize));
        paginationResponse.setLastPage(pageNumber >= (Math.ceil((double) totalElements / pageSize) - 1));

        return paginationResponse;
    }


    private List<ProductRuleDto> mapToDto(List<ProductRule> leadsList) {
        return leadsList.stream()
                .map(productRuleMapper::toDto)
                .collect(Collectors.toList());
    }

    private Long countTotalElements(CriteriaBuilder criteriaBuilder, ProductRuleDto searchCriteria) {
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<ProductRule> root = countQuery.from(ProductRule.class);
        countQuery.select(criteriaBuilder.count(root));

        List<Predicate> predicates = buildPredicates(criteriaBuilder, root, searchCriteria);
        countQuery.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(countQuery).getSingleResult();
    }


    private List<Predicate> buildPredicates(CriteriaBuilder criteriaBuilder, Root<ProductRule> productRuleRoot, ProductRuleDto searchCriteria) {
        List<Predicate> predicates = new ArrayList<>();

        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getBusinessCategory(), productRuleRoot.get("businessCategory"));
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getType(), productRuleRoot.get("type"));
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getStatus(), productRuleRoot.get("status"));

        return predicates;
    }

    private void addLikePredicateIfPresent(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, String value, Path<String> path) {
        Optional.ofNullable(value)
                .ifPresent(v -> predicates.add(criteriaBuilder.like(path, "%" + v + "%")));
    }
}
