package com.PrintLab.service.impl;

import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.PaperMarketRates;
import com.PrintLab.model.Vendor;
import com.PrintLab.repository.PaperMarketRatesRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.PaperMarketRatesService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaperMarketRatesServiceImpI implements PaperMarketRatesService
{
    private final PaperMarketRatesRepository paperMarketRatesRepository;
    private final VendorRepository vendorRepository;
    private final EntityManager entityManager;

    public PaperMarketRatesServiceImpI(PaperMarketRatesRepository paperMarketRatesRepository, VendorRepository vendorRepository, EntityManager entityManager) {
        this.paperMarketRatesRepository = paperMarketRatesRepository;
        this.vendorRepository = vendorRepository;
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public PaperMarketRatesDto save(PaperMarketRatesDto paperMarketRatesDto) {
        paperMarketRatesDto.setRecordType("manual");
        PaperMarketRates paperMarketRates = toEntity(paperMarketRatesDto);
        PaperMarketRates savedPaperMarketRates = paperMarketRatesRepository.save(paperMarketRates);
        return toDto(savedPaperMarketRates);
    }

    @Override
    public PaginationResponse getAllPaginatedPaperMarketRates(Integer pageNumber, Integer pageSize) {

        Pageable page = PageRequest.of(pageNumber,pageSize);
        Page<PaperMarketRates> pagePaperMarketRates = paperMarketRatesRepository.findAll(page);
        List<PaperMarketRates> paperMarketRatesList = pagePaperMarketRates.getContent();

        List<PaperMarketRatesDto> paperMarketRatesDtoList = new ArrayList<>();
        for (PaperMarketRates paperMarketRates : paperMarketRatesList) {
            PaperMarketRatesDto paperMarketRatesDto = toDto(paperMarketRates);
            paperMarketRatesDtoList.add(paperMarketRatesDto);
        }

        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setContent(paperMarketRatesDtoList);
        paginationResponse.setPageNumber(pagePaperMarketRates.getNumber());
        paginationResponse.setPageSize(pagePaperMarketRates.getSize());
        paginationResponse.setTotalElements(pagePaperMarketRates.getNumberOfElements());
        paginationResponse.setTotalPages(pagePaperMarketRates.getTotalPages());
        paginationResponse.setLastPage(pagePaperMarketRates.isLast());

        return paginationResponse;
    }

    @Override
    public List<PaperMarketRatesDto> getAll() {
        List<PaperMarketRates> paperMarketRatesList = paperMarketRatesRepository.findAll();
        List<PaperMarketRatesDto> paperMarketRatesDtoList = new ArrayList<>();

        for (PaperMarketRates paperMarketRates : paperMarketRatesList) {
            PaperMarketRatesDto paperMarketRatesDto = toDto(paperMarketRates);
            paperMarketRatesDtoList.add(paperMarketRatesDto);
        }
        return paperMarketRatesDtoList;
    }

    @Override
    public PaginationResponse getPaperMarketRatesBySearchCriteria(Integer pageNumber, Integer pageSize, PaperMarketRatesDto searchCriteria) {

        Pageable page = PageRequest.of(pageNumber,pageSize);
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<PaperMarketRates> cq = criteriaBuilder.createQuery(PaperMarketRates.class);
        Root<PaperMarketRates> paperMarketRatesRoot = cq.from(PaperMarketRates.class);

        List<Predicate> predicates = new ArrayList<>();

        if (searchCriteria.getTimeStamp() != null) {
            LocalDateTime userEnteredDateTime = searchCriteria.getTimeStamp();
            LocalDate userEnteredDate = userEnteredDateTime.toLocalDate();
            LocalDate currentLocalDate = LocalDate.now();
            predicates.add(criteriaBuilder.between(paperMarketRatesRoot.get("timeStamp").as(LocalDate.class), userEnteredDate, currentLocalDate));
        }

        if (searchCriteria.getPaperStock() != null) {
            predicates.add(criteriaBuilder.like(paperMarketRatesRoot.get("paperStock"), searchCriteria.getPaperStock()));
        }

        if (searchCriteria.getBrand() != null) {
            predicates.add(criteriaBuilder.like(paperMarketRatesRoot.get("brand"), searchCriteria.getBrand()));
        }

        if (searchCriteria.getMadeIn() != null) {
            predicates.add(criteriaBuilder.like(paperMarketRatesRoot.get("madeIn"), searchCriteria.getMadeIn()));
        }

        if (searchCriteria.getGSM() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(paperMarketRatesRoot.get("GSM"), searchCriteria.getGSM()));
        }

        if (searchCriteria.getLength() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(paperMarketRatesRoot.get("length"), searchCriteria.getLength()));
        }

        if (searchCriteria.getWidth() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(paperMarketRatesRoot.get("width"), searchCriteria.getWidth()));
        }

        if (searchCriteria.getDimension() != null) {
            predicates.add(criteriaBuilder.like(paperMarketRatesRoot.get("dimension"), searchCriteria.getDimension()));
        }

        if (searchCriteria.getQty() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(paperMarketRatesRoot.get("qty"), searchCriteria.getQty()));
        }

        if (searchCriteria.getKg() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(paperMarketRatesRoot.get("kg"), searchCriteria.getKg()));
        }

        if (searchCriteria.getRecordType() != null) {
            predicates.add(criteriaBuilder.like(paperMarketRatesRoot.get("recordType"), searchCriteria.getRecordType()));
        }

        if (searchCriteria.getRatePkr() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(paperMarketRatesRoot.get("ratePkr"), searchCriteria.getRatePkr()));
        }

        if (searchCriteria.getVerified() != null) {
            predicates.add(criteriaBuilder.equal(paperMarketRatesRoot.get("verified"), searchCriteria.getVerified()));
        }

        if (searchCriteria.getNotes() != null) {
            predicates.add(criteriaBuilder.like(paperMarketRatesRoot.get("notes"), searchCriteria.getNotes()));
        }

        if (searchCriteria.getStatus() != null) {
            predicates.add(criteriaBuilder.like(paperMarketRatesRoot.get("status"), searchCriteria.getStatus()));
        }

        if (searchCriteria.getVendor() != null) {
            predicates.add(criteriaBuilder.equal(paperMarketRatesRoot.get("vendor"), searchCriteria.getVendor()));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        TypedQuery<PaperMarketRates> query = entityManager.createQuery(cq);

        int firstResult = pageNumber * pageSize;
        query.setFirstResult(firstResult);
        query.setMaxResults(pageSize);

        List<PaperMarketRates> resultList = query.getResultList();

        // Count total elements for pagination
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        countQuery.select(criteriaBuilder.count(countQuery.from(PaperMarketRates.class)));
        countQuery.where(predicates.toArray(new Predicate[0]));
        Long totalElements = entityManager.createQuery(countQuery).getSingleResult();

        // Map filtered PaperMarketRates entities to PaperMarketRatesDto objects
        List<PaperMarketRatesDto> dtoList = resultList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        // Create a PaginationResponse object and set its properties
        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setContent(dtoList);
        paginationResponse.setPageNumber(pageNumber);
        paginationResponse.setPageSize(pageSize);
        paginationResponse.setTotalElements(totalElements.intValue());
        paginationResponse.setTotalPages((int) Math.ceil((double) totalElements / pageSize));
        paginationResponse.setLastPage(pageNumber >= (Math.ceil((double) totalElements / pageSize) - 1));

        return paginationResponse;
    }


    @Override
    public Set<String> findDistinctPaperStocks() {
        return paperMarketRatesRepository.findDistinctPaperStocks();
    }

    @Override
    public Set<Vendor> findDistinctVendorsByPaperStock(String paperStock) {
        Set<Long> vendorIdList = paperMarketRatesRepository.findDistinctVendorsByPaperStock(paperStock);
        Set<Vendor> vendorSet = new HashSet<>();
        for (Long vendorId : vendorIdList) {
            Vendor vendor = vendorRepository.findById(vendorId)
                    .orElseThrow(() -> new RecordNotFoundException("Vendor not found for id: " + vendorId));
            vendorSet.add(vendor);
        }
        return vendorSet;
    }

    @Override
    public Set<String> findDistinctBrandsByPaperStockAndVendor(String paperStock, Vendor vendor) {
        return paperMarketRatesRepository.findDistinctBrandsByPaperStockAndVendor(paperStock,vendor.getId());
    }

    @Override
    public Set<String> findMadeInByPaperStockAndVendorAndBrand(String paperStock,Vendor vendor, String brand) {
        return paperMarketRatesRepository.findDistinctMadeInByPaperStockAndVendorAndBrand(paperStock,vendor.getId(),brand);
    }

    @Override
    public Set<String> findDimensionByPaperStockAndVendorAndBrandAndMadeIn(String paperStock, Vendor vendor, String brand, String madeIn) {
        return paperMarketRatesRepository.findDistinctDimensionByPaperStockAndVendorAndBrandAndMadeIn(paperStock, vendor.getId(), brand, madeIn);
    }

    @Override
    public Set<String> findGsmByPaperStockAndVendorAndBrandAndMadeInAndDimension(String paperStock, Vendor vendor, String brand, String madeIn, String dimension) {
        return paperMarketRatesRepository.findDistinctGsmByPaperStockAndVendorAndBrandAndMadeInAndDimension(paperStock, vendor.getId(), brand, madeIn, dimension);
    }

    @Override
    public List<PaperMarketRatesDto> findPaperMarketRateByEveryColumn(String paperStock, Long vendorId, String brand, String madeIn, String dimension, List<Integer> gsm) {
        List<PaperMarketRates> paperMarketRatesList = paperMarketRatesRepository.findPaperMarketRateByEveryColumn(paperStock,vendorId,brand,madeIn,dimension,gsm);
        List<PaperMarketRatesDto> paperMarketRatesDtoList = new ArrayList<>();

        if (paperMarketRatesList == null) {
            throw new RecordNotFoundException("Paper market rates not found for the given criteria.");
        }

        for (PaperMarketRates paperMarketRates : paperMarketRatesList) {
            PaperMarketRatesDto paperMarketRatesDto = toDto(paperMarketRates);
            paperMarketRatesDtoList.add(paperMarketRatesDto);
        }
        return paperMarketRatesDtoList;
    }

    @Override
    public List<PaperMarketRatesDto> findAllPaperMarketRatesByPaperStock(String paperStock) {
        List<PaperMarketRates> paperMarketRatesList =
                paperMarketRatesRepository.findAllPaperMarketRatesByPaperStockOrderByTimestampDesc(paperStock);
        List<PaperMarketRatesDto> paperMarketRatesDtoList = new ArrayList<>();

        for (PaperMarketRates paperMarketRates : paperMarketRatesList) {
            PaperMarketRatesDto paperMarketRatesDto = toDto(paperMarketRates);
            paperMarketRatesDtoList.add(paperMarketRatesDto);
        }
        return paperMarketRatesDtoList;
    }

    @Override
    public List<Integer> getDistinctGSMForPaperStock(String paperStock) {
        Optional<List<Integer>> optionalGsmList = Optional.ofNullable(paperMarketRatesRepository.findDistinctGSMByPaperStock(paperStock));
        if(optionalGsmList.isPresent()){
            return optionalGsmList.get();
        }
        else{
            throw new RecordNotFoundException("PaperStock not found at: " + paperStock);
        }
    }

    @Override
    public PaperMarketRatesDto findByPaperStock(String paperStock) {
        Optional<PaperMarketRates> paperMarketRates = Optional.ofNullable(paperMarketRatesRepository.findByPaperStock(paperStock));
        if(paperMarketRates.isPresent()){
            PaperMarketRates pmr = paperMarketRates.get();
            return toDto(pmr);
        }
        else {
            throw new RecordNotFoundException(String.format("Paper Market Rate not found at => %s", paperStock));
        }
    }

    @Override
    public List<PaperMarketRatesDto> searchByPaperStock(String paperStock) {
        List<PaperMarketRates> paperMarketRateList = paperMarketRatesRepository.findPaperMarketRatesByPaperStock(paperStock);
        List<PaperMarketRatesDto> paperMarketRatesDtoList = new ArrayList<>();

        for (PaperMarketRates paperMarketRates : paperMarketRateList) {
            PaperMarketRatesDto paperMarketRatesDto = toDto(paperMarketRates);
            paperMarketRatesDtoList.add(paperMarketRatesDto);
        }
        return paperMarketRatesDtoList;
    }


    @Override
    public PaperMarketRatesDto findById(Long id) {
        Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findById(id);

        if(optionalPaperMarketRates.isPresent()) {
            PaperMarketRates paperMarketRates = optionalPaperMarketRates.get();
            return toDto(paperMarketRates);
        }
        else {
            throw new RecordNotFoundException(String.format("Paper Market Rate not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public String deleteById(Long id) {
        Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findById(id);

        if(optionalPaperMarketRates.isPresent()) {
            PaperMarketRates paperMarketRates = optionalPaperMarketRates.get();
            paperMarketRatesRepository.deleteById(id);
        }
        else{
            throw new RecordNotFoundException(String.format("Paper Market Rate not found for id => %d", id));
        }
        return null;
    }

    @Override
    @Transactional
    public PaperMarketRatesDto updatePaperMarketRates(Long id, PaperMarketRatesDto paperMarketRatesDto) {
        PaperMarketRates paperMarketRates = toEntity(paperMarketRatesDto);
        Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findById(id);
        if(optionalPaperMarketRates.isPresent()){
            PaperMarketRates existingPmr = optionalPaperMarketRates.get();

            // Round off both ratePkr values to 1 decimal place
            double existingRate = Math.round(existingPmr.getRatePkr() * 10.0) / 10.0;
            double newRate = Math.round(paperMarketRates.getRatePkr() * 10.0) / 10.0;

            // Check if rounded ratePkr values are different
            if (existingRate != newRate) {
                existingPmr.setTimeStamp(LocalDateTime.now());
            }

            existingPmr.setPaperStock(paperMarketRates.getPaperStock());
            existingPmr.setBrand(paperMarketRates.getBrand());
            existingPmr.setMadeIn(paperMarketRates.getMadeIn());
            existingPmr.setGSM(paperMarketRates.getGSM());
            existingPmr.setLength(paperMarketRates.getLength());
            existingPmr.setWidth(paperMarketRates.getWidth());
            existingPmr.setDimension(paperMarketRates.getDimension());
            existingPmr.setQty(paperMarketRates.getQty());
            existingPmr.setKg(paperMarketRates.getKg());
            existingPmr.setRatePkr(paperMarketRates.getRatePkr());
            existingPmr.setVerified(paperMarketRates.getVerified());
            existingPmr.setNotes(paperMarketRates.getNotes());
            existingPmr.setStatus(paperMarketRates.getStatus());
            existingPmr.setRecordType(paperMarketRates.getRecordType());

            existingPmr.setVendor(vendorRepository.findById(paperMarketRates.getVendor())
                    .orElseThrow(() -> new RecordNotFoundException("Vendor not found")).getId());

            if(paperMarketRates.getRecordType() == null){
                existingPmr.setRecordType("manual");
            }

            PaperMarketRates updatedPmr = paperMarketRatesRepository.save(existingPmr);
            return toDto(updatedPmr);
        }
        else {
            throw new RecordNotFoundException(String.format("Paper Market Rate not found for id => %d", id));
        }
    }

    @Override
    public Map<String,String> findAllDistinctValues() {
        return paperMarketRatesRepository.findAllDistinctValues();
    }

    public PaperMarketRatesDto toDto(PaperMarketRates paperMarketRates) {
        return PaperMarketRatesDto.builder()
                .id(paperMarketRates.getId())
                .timeStamp(paperMarketRates.getTimeStamp())
                .paperStock(paperMarketRates.getPaperStock())
                .brand(paperMarketRates.getBrand())
                .madeIn(paperMarketRates.getMadeIn())
                .GSM(paperMarketRates.getGSM())
                .length(paperMarketRates.getLength())
                .width(paperMarketRates.getWidth())
                .dimension(paperMarketRates.getDimension())
                .qty(paperMarketRates.getQty())
                .kg(paperMarketRates.getKg())
                .recordType(paperMarketRates.getRecordType())
                .ratePkr(paperMarketRates.getRatePkr())
                .verified(paperMarketRates.getVerified())
                .notes(paperMarketRates.getNotes())
                .status(paperMarketRates.getStatus())
                .vendor(vendorRepository.findById(paperMarketRates.getVendor())
                        .orElseThrow(() -> new RecordNotFoundException("Vendor not found")))
                .build();
    }

    public PaperMarketRates toEntity(PaperMarketRatesDto paperMarketRatesDto) {
        return PaperMarketRates.builder()
                .id(paperMarketRatesDto.getId())
                .timeStamp(paperMarketRatesDto.getTimeStamp())
                .paperStock(paperMarketRatesDto.getPaperStock())
                .brand(paperMarketRatesDto.getBrand())
                .madeIn(paperMarketRatesDto.getMadeIn())
                .GSM(paperMarketRatesDto.getGSM())
                .length(paperMarketRatesDto.getLength())
                .width(paperMarketRatesDto.getWidth())
                .dimension(paperMarketRatesDto.getDimension())
                .qty(paperMarketRatesDto.getQty())
                .kg(paperMarketRatesDto.getKg())
                .recordType(paperMarketRatesDto.getRecordType())
                .ratePkr(paperMarketRatesDto.getRatePkr())
                .verified(paperMarketRatesDto.getVerified())
                .notes(paperMarketRatesDto.getNotes())
                .status(paperMarketRatesDto.getStatus())
                .vendor(vendorRepository.findById(paperMarketRatesDto.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Vendor not found")).getId())
                .build();
    }

}
