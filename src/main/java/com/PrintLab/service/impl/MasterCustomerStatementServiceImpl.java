package com.PrintLab.service.impl;

import com.PrintLab.Mapper.MasterCustomerStatementMapper;
import com.PrintLab.dto.MasterCustomerStatementDto;
import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.model.MasterCustomerStatement;
import com.PrintLab.repository.MasterCustomerStatementRepository;
import com.PrintLab.service.MasterCustomerStatementService;
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
public class MasterCustomerStatementServiceImpl implements MasterCustomerStatementService {

    private final MasterCustomerStatementRepository masterCustomerStatementRepository;
    private final MasterCustomerStatementMapper masterCustomerStatementMapper;
    private final EntityManager entityManager;

    public MasterCustomerStatementServiceImpl(MasterCustomerStatementRepository masterCustomerStatementRepository, MasterCustomerStatementMapper masterCustomerStatementMapper, EntityManager entityManager) {
        this.masterCustomerStatementRepository = masterCustomerStatementRepository;
        this.masterCustomerStatementMapper = masterCustomerStatementMapper;
        this.entityManager = entityManager;
    }

    @Override
    public MasterCustomerStatementDto findById(Long id) {
        Optional<MasterCustomerStatement> paymentHistoryOptional = masterCustomerStatementRepository.findById(id);
        return paymentHistoryOptional.map(masterCustomerStatementMapper::toDto).orElse(null);
    }

    @Override
    public List<MasterCustomerStatementDto> getAll() {
        List<MasterCustomerStatement> paymentHistories = masterCustomerStatementRepository.findAll();
        Set<Long> seenId = new LinkedHashSet<>();
        return paymentHistories.stream()
                .filter(masterCustomerStatement -> seenId.add(masterCustomerStatement.getId()))
                .map(masterCustomerStatementMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MasterCustomerStatementDto save(MasterCustomerStatementDto masterCustomerStatementDto) {
        MasterCustomerStatement customerStatement = masterCustomerStatementMapper.toEntity(masterCustomerStatementDto);
        MasterCustomerStatement saved = masterCustomerStatementRepository.save(customerStatement);
        return masterCustomerStatementMapper.toDto(saved);
    }

    @Override
    public void deleteById(Long id) {
        masterCustomerStatementRepository.deleteById(id);
    }

    @Override
    public MasterCustomerStatementDto updateById(Long id, MasterCustomerStatementDto customerStatementDto) {
        Optional<MasterCustomerStatement> customerStatement = masterCustomerStatementRepository.findById(id);
        if (customerStatement.isPresent()) {
            MasterCustomerStatement masterCustomerStatement = customerStatement.get();
            masterCustomerStatement.setDebit(customerStatementDto.getDebit());
            masterCustomerStatement.setCredit(customerStatementDto.getCredit());
            masterCustomerStatement.setDescription(customerStatementDto.getDescription());

            MasterCustomerStatement updatedCustomerStatement = masterCustomerStatementRepository.save(masterCustomerStatement);
            return masterCustomerStatementMapper.toDto(updatedCustomerStatement);
        }
        return null;
    }
    @Override
    @Transactional
    public PaginationResponse getAllPaginatedStatements(Integer pageNumber, Integer pageSize, MasterCustomerStatementDto searchCriteria) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        CriteriaQuery<MasterCustomerStatement> cq = criteriaBuilder.createQuery(MasterCustomerStatement.class);
        Root<MasterCustomerStatement> statementRoot = cq.from(MasterCustomerStatement.class);

        List<Predicate> predicates = buildPredicates(criteriaBuilder, statementRoot, searchCriteria);
        cq.where(predicates.toArray(new Predicate[0]));

        TypedQuery<MasterCustomerStatement> query = entityManager.createQuery(cq);
        applyPagination(query, pageNumber, pageSize);

        List<MasterCustomerStatement> resultList = query.getResultList();
        Long totalElements = countTotalElements(criteriaBuilder, searchCriteria);

        List<MasterCustomerStatementDto> dtoList = mapAndSortInDescendingOrder(resultList);

        return createPaginationResponse(dtoList, pageNumber, pageSize, totalElements);
    }

    private void applyPagination(TypedQuery<?> query, Integer pageNumber, Integer pageSize) {
        int firstResult = pageNumber * pageSize;
        query.setFirstResult(firstResult);
        query.setMaxResults(pageSize);
    }

    private PaginationResponse createPaginationResponse(List<MasterCustomerStatementDto> dtoList, Integer pageNumber, Integer pageSize, Long totalElements) {
        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setContent(dtoList);
        paginationResponse.setPageNumber(pageNumber);
        paginationResponse.setPageSize(pageSize);
        paginationResponse.setTotalElements(totalElements.intValue());

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);
        paginationResponse.setTotalPages(totalPages);
        paginationResponse.setLastPage(pageNumber >= totalPages - 1);

        return paginationResponse;
    }

    private List<MasterCustomerStatementDto> mapAndSortInDescendingOrder(List<MasterCustomerStatement> statementList) {
        return statementList.stream()
                .sorted(Comparator.comparing(MasterCustomerStatement::getId).reversed())
                .map(masterCustomerStatementMapper::toDto)
                .collect(Collectors.toList());
    }

    private Long countTotalElements(CriteriaBuilder criteriaBuilder, MasterCustomerStatementDto searchCriteria) {
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<MasterCustomerStatement> root = countQuery.from(MasterCustomerStatement.class);
        countQuery.select(criteriaBuilder.countDistinct(root));

        List<Predicate> predicates = buildPredicates(criteriaBuilder, root, searchCriteria);
        countQuery.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(countQuery).getSingleResult();
    }

    private List<Predicate> buildPredicates(CriteriaBuilder criteriaBuilder, Root<MasterCustomerStatement> statementRoot, MasterCustomerStatementDto searchCriteria) {
        List<Predicate> predicates = new ArrayList<>();

        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getDescription(), statementRoot.get("description"));
        addEqualPredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getDebit(), statementRoot.get("debit"), Double.class);

        if (searchCriteria.getDate() != null) {
            addTimeStampPredicate(criteriaBuilder, predicates, statementRoot, searchCriteria.getDate());
        }
        if (searchCriteria.getDateList() != null) {
            addFromToDatePredicate(criteriaBuilder, predicates, statementRoot, searchCriteria.getDateList());
        }

        return predicates;
    }

    private void addFromToDatePredicate(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, Root<MasterCustomerStatement> statementRoot, List<LocalDateTime> dateList) {
        LocalDate fromDate = dateList.get(0).toLocalDate();
        LocalDate toDate = dateList.get(1).toLocalDate();
        predicates.add(criteriaBuilder.between(statementRoot.get("date"), fromDate, toDate));
    }

    private <T> void addEqualPredicateIfPresent(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, T value, Path<T> path, Class<T> valueType) {
        if (value != null) {
            predicates.add(criteriaBuilder.equal(path, value));
        }
    }

    private void addLikePredicateIfPresent(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, String value, Path<String> path) {
        if (value != null && !value.trim().isEmpty()) {
            predicates.add(criteriaBuilder.like(path, "%" + value + "%"));
        }
    }

    private void addTimeStampPredicate(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, Root<MasterCustomerStatement> statementRoot, LocalDate localDate) {
        LocalDate currentLocalDate = LocalDate.now();
        predicates.add(criteriaBuilder.between(statementRoot.get("date"), localDate, currentLocalDate));
    }

}
