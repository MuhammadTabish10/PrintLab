package com.PrintLab.service.impl;

import com.PrintLab.Mapper.OrderItemsMapper;
import com.PrintLab.dto.BusinessDto;
import com.PrintLab.dto.OrderDto;
import com.PrintLab.dto.OrderItemsDto;
import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Order;
import com.PrintLab.model.*;
import com.PrintLab.repository.BusinessRepository;
import com.PrintLab.repository.CustomerRepository;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.repository.UserRepository;
import com.PrintLab.service.OrderService;
import com.PrintLab.utils.EmailUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final CustomerRepository customerRepository;
    private final BusinessRepository businessRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;
    private final EmailUtils emailUtils;
    private final OrderItemsMapper orderItemsMapper;

    public OrderServiceImpl(OrderRepository orderRepository, CustomerRepository customerRepository, BusinessRepository businessRepository, EntityManager entityManager, UserRepository userRepository, EmailUtils emailUtils, OrderItemsMapper orderItemsMapper) {
        this.customerRepository = customerRepository;
        this.businessRepository = businessRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
        this.emailUtils = emailUtils;
        this.orderItemsMapper = orderItemsMapper;
    }


    @Override
    @Transactional
    public OrderDto save(OrderDto orderDto, Long loggedInUserId) {
        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new RecordNotFoundException("User not found at id: " + loggedInUserId));
        if (orderDto.getSideOptionValue() == null) {
            orderDto.setSideOptionValue("SINGLE_SIDED");
        }
        if (!orderDto.getImpositionValue() && orderDto.getSideOptionValue().equals("DOUBLE_SIDED")) {
            if (orderDto.getJobColorsFront() == null) {
                orderDto.setJobColorsFront(1L);
            }
            if (orderDto.getJobColorsBack() == null) {
                orderDto.setJobColorsBack(1L);
            }
        } else if (orderDto.getImpositionValue() && orderDto.getSideOptionValue().equals("DOUBLE_SIDED")) {
            if (orderDto.getJobColorsFront() == null) {
                orderDto.setJobColorsFront(1L);
            }
        } else if (orderDto.getSideOptionValue().equals("SINGLE_SIDED")) {
            if (orderDto.getJobColorsFront() == null) {
                orderDto.setJobColorsFront(1L);
            }
        }
        if (orderDto.getQuantity() == null) {
            orderDto.setQuantity(1000.0);
        }

        orderDto.setStatus("New / Unassigned");
        orderDto.setCreatedBy(loggedInUser);
        ZonedDateTime zonedDateTime = ZonedDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
        LocalDateTime timeStampUtc = zonedDateTime.toLocalDateTime();
        orderDto.setTimeStamp(timeStampUtc);
        orderDto.setCtpProcess(false);
        orderDto.setPressMachineProcess(false);
        orderDto.setPaperMarketProcess(false);
        Order order = orderRepository.save(toEntity(orderDto));
        return toDto(order);
    }

    @Override
    public List<OrderDto> getAll() {
        List<Order> orderList = orderRepository.findAllByOrderByIdDesc();
        List<OrderDto> orderDtoList = new ArrayList<>();

        for (Order order : orderList) {
            OrderDto orderDto = toDto(order);
            orderDtoList.add(orderDto);
        }
        return orderDtoList;
    }

    @Override
    public List<OrderDto> searchByProduct(String product) {
        List<Order> orderList = orderRepository.findOrderByProduct(product);
        List<OrderDto> orderDtoList = new ArrayList<>();

        for (Order order : orderList) {
            OrderDto orderDto = toDto(order);
            orderDtoList.add(orderDto);
        }
        return orderDtoList;
    }

    @Override
    public OrderDto findByIdAndType(Long id, String type) {
        Optional<Order> optionalOrder = orderRepository.findByIdAndType(id, type);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            return toDto(order);
        } else {
            throw new RecordNotFoundException(String.format("Order not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public String deleteById(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            orderRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException(String.format("Order not found for id => %d", id));
        }
        return null;
    }

    @Override
    @Transactional
    public OrderDto updateOrder(Long id, OrderDto orderDto) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order existingOrder = optionalOrder.get();
            if (existingOrder.getType().equalsIgnoreCase("auto")) {
                existingOrder.setProduct(orderDto.getProduct());
                existingOrder.setPaper(orderDto.getPaper());
                existingOrder.setSize(orderDto.getSize());
                existingOrder.setSizeCategory(orderDto.getSizeCategory());
                existingOrder.setGsm(orderDto.getGsm());
                existingOrder.setQuantity(orderDto.getQuantity());
                existingOrder.setAmount(orderDto.getAmount());
                existingOrder.setJobColorsFront(orderDto.getJobColorsFront());
                existingOrder.setSideOptionValue(orderDto.getSideOptionValue());
                existingOrder.setImpositionValue(orderDto.getImpositionValue());
                existingOrder.setJobColorsBack(orderDto.getJobColorsBack());
                existingOrder.setProvidedDesign(orderDto.getProvidedDesign());
                existingOrder.setUrl(orderDto.getUrl());
                existingOrder.setCustomer(customerRepository.findById(orderDto.getCustomer().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Customer not found at id => " + orderDto.getCustomer().getId())));
            } else {
                updateProductionJobFields(existingOrder, orderDto);
                updateBusinesses(existingOrder, orderDto);
            }
            Order updatedOrder = orderRepository.save(existingOrder);
            return toDto(updatedOrder);
        } else {
            throw new RecordNotFoundException(String.format("Order not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public OrderDto assignOrderToUser(Long orderId, Long userId, String role, Long loggedInUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RecordNotFoundException("User not found at id: " + userId));
        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new RecordNotFoundException("User not found at id: " + loggedInUserId));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RecordNotFoundException("Order not found at id: " + orderId));

        if (role.equalsIgnoreCase("ROLE_PRODUCTION")) {
            order.setProduction(user);
            emailUtils.sendOrderAssignedEmail(user.getEmail(), order);
        } else if (role.equalsIgnoreCase("ROLE_DESIGNER")) {
            order.setDesigner(user);
            emailUtils.sendOrderAssignedEmail(user.getEmail(), order);
        } else if (role.equalsIgnoreCase("ROLE_PLATE_SETTER")) {
            order.setPlateSetter(user);
            emailUtils.sendOrderAssignedEmail(user.getEmail(), order);
        }
        ZonedDateTime zonedDateTime = ZonedDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
        LocalDateTime timeStampUtc = zonedDateTime.toLocalDateTime();
        order.setTimeStamp(timeStampUtc);
        order.setStatus("Connected");
        order.setAssignedBy(loggedInUser);
        orderRepository.save(order);
        return toDto(order);
    }

    @Override
    public List<Order> getAssignedOrdersForLoggedInUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Order> assignedOrders = new ArrayList<>();

        if (principal instanceof CustomUserDetail) {
            String email = ((CustomUserDetail) principal).getEmail();
            User user = userRepository.findByEmailAndStatusIsTrue(email);

            if (user != null) {
                for (Role role : user.getRoles()) {
                    if ("ROLE_PRODUCTION".equals(role.getName())) {
                        assignedOrders.addAll(orderRepository.findByProduction(user));
                    } else if ("ROLE_DESIGNER".equals(role.getName())) {
                        assignedOrders.addAll(orderRepository.findByDesigner(user));
                    } else if ("ROLE_PLATE_SETTER".equals(role.getName())) {
                        assignedOrders.addAll(orderRepository.findByPlateSetter(user));
                    }
                }
            }
        }
        return assignedOrders;
    }

    @Override
    @Transactional
    public void updateCtpProcess(Long id, Boolean isDone) {
        orderRepository.setCtpMarkAsDone(id, isDone);
    }

    @Override
    @Transactional
    public void updatePaperMarketProcess(Long id, Boolean isDone) {
        orderRepository.setPaperMarketProcessProcessMarkAsDone(id, isDone);
    }

    @Override
    @Transactional
    public void updatePressMachineProcess(Long id, Boolean isDone) {
        orderRepository.setPressMachineProcessMarkAsDone(id, isDone);
    }

    @Override
    public void reject(Long id, Boolean rejected) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order existingOrder = optionalOrder.get();
            existingOrder.setIsRejected(rejected);
            orderRepository.save(existingOrder);
        } else {
            throw new RecordNotFoundException(String.format("Order not found for id => %d", id));
        }
    }

    private void updateProductionJobFields(Order productionJob, OrderDto productionJobDto) {
        productionJob.setCustomer(productionJobDto.getCustomer());
        productionJob.setBusinessCategory(productionJobDto.getBusinessCategory());
        productionJob.setProductionUser(productionJobDto.getProductionUser());
        productionJob.setProductCategory(productionJobDto.getProductCategory());
        productionJob.setProduct(productionJobDto.getProduct());
        productionJob.setDescription(productionJobDto.getDescription());
        productionJob.setQuantity(productionJobDto.getQuantity());
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
        productionJob.setSizeCategory(productionJobDto.getSizeCategory());
        productionJob.setSize(productionJobDto.getSize());
        productionJob.setTimeStamp(productionJobDto.getTimeStamp());
        productionJob.setStatus(productionJobDto.getStatus());
        productionJob.setCreatedBy(productionJobDto.getCreatedBy());
    }

    private void updateBusinesses(Order productionJob, OrderDto productionJobDto) {
        if (productionJobDto.getBusinesses() != null) {
            List<Business> updatedBusinesses = new ArrayList<>();
            for (BusinessDto businessDto : productionJobDto.getBusinesses()) {
                Business business = businessRepository.findById(businessDto.getId())
                        .orElseThrow(() -> new RecordNotFoundException("Business not found for id => " + businessDto.getId()));
                if (business != null) {
                    updatedBusinesses.add(business);
                }
            }
            productionJob.setBusinesses(updatedBusinesses);
        }
    }

    @Override
    public PaginationResponse getAllPaginatedOrders(Integer pageNumber, Integer pageSize, OrderDto searchCriteria) {
        Pageable page = PageRequest.of(pageNumber, pageSize);
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Order> cq = criteriaBuilder.createQuery(Order.class);
        Root<Order> leadsRoot = cq.from(Order.class);

        List<Predicate> predicates = buildPredicates(criteriaBuilder, leadsRoot, searchCriteria);
        cq.where(predicates.toArray(new Predicate[0]));
        cq.orderBy(criteriaBuilder.desc(leadsRoot.get("id")));

        TypedQuery<Order> query = entityManager.createQuery(cq);
        applyPagination(query, pageNumber, pageSize);

        List<Order> resultList = query.getResultList();
        Long totalElements = countTotalElements(criteriaBuilder, searchCriteria);
        List<OrderDto> dtoList = mapToDto(resultList);

        return createPaginationResponse(dtoList, pageNumber, pageSize, totalElements);
    }

    private void applyPagination(TypedQuery<?> query, Integer pageNumber, Integer pageSize) {
        int firstResult = pageNumber * pageSize;
        query.setFirstResult(firstResult);
        query.setMaxResults(pageSize);
    }

    private PaginationResponse createPaginationResponse(List<OrderDto> dtoList, Integer pageNumber, Integer pageSize, Long totalElements) {
        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setContent(dtoList);
        paginationResponse.setPageNumber(pageNumber);
        paginationResponse.setPageSize(pageSize);
        paginationResponse.setTotalElements(totalElements.intValue());
        paginationResponse.setTotalPages((int) Math.ceil((double) totalElements / pageSize));
        paginationResponse.setLastPage(pageNumber >= (Math.ceil((double) totalElements / pageSize) - 1));

        return paginationResponse;
    }


    private List<OrderDto> mapToDto(List<Order> leadsList) {
        return leadsList.stream()
                .map(this::toDto)
                .sorted(Comparator.comparing(OrderDto::getTimeStamp).reversed())
                .collect(Collectors.toList());
    }

    private Long countTotalElements(CriteriaBuilder criteriaBuilder, OrderDto searchCriteria) {
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Order> root = countQuery.from(Order.class);
        countQuery.select(criteriaBuilder.count(root));

        List<Predicate> predicates = buildPredicates(criteriaBuilder, root, searchCriteria);
        countQuery.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(countQuery).getSingleResult();
    }


    private List<Predicate> buildPredicates(CriteriaBuilder criteriaBuilder, Root<Order> orderRoot, OrderDto searchCriteria) {
        List<Predicate> predicates = new ArrayList<>();

        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getBusinessCategory(), orderRoot.get("businessCategory"));
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getProduct(), orderRoot.get("product"));
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getStatus(), orderRoot.get("status"));
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getType(), orderRoot.get("type"));

        Optional.ofNullable(searchCriteria.getCreatedBy())
                .ifPresent(createdBy -> addCreatedByPredicate(criteriaBuilder, predicates, orderRoot, createdBy));

        Optional.ofNullable(searchCriteria.getTimeStamp())
                .ifPresent(timeStamp -> addTimeStampPredicate(criteriaBuilder, predicates, orderRoot, timeStamp));

        Optional.ofNullable(searchCriteria.getBusinesses())
                .ifPresent(businesses -> addBusinessPredicate(criteriaBuilder, predicates, orderRoot, businesses));

        return predicates;
    }


    private void addLikePredicateIfPresent(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, String value, Path<String> path) {
        Optional.ofNullable(value)
                .ifPresent(v -> predicates.add(criteriaBuilder.like(path, "%" + v + "%")));
    }

    private void addCreatedByPredicate(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, Root<Order> orderRoot, User createdBy) {
        Join<Order, User> createdByJoin = orderRoot.join("createdBy");
        predicates.add(criteriaBuilder.like(createdByJoin.get("name"), "%" + createdBy.getName() + "%"));
    }

    private void addTimeStampPredicate(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, Root<Order> orderRoot, LocalDateTime timeStamp) {
        LocalDate userEnteredDate = timeStamp.toLocalDate();
        LocalDate currentLocalDate = LocalDate.now();
        predicates.add(criteriaBuilder.between(orderRoot.get("timeStamp").as(LocalDate.class), userEnteredDate, currentLocalDate));
    }

    private void addBusinessPredicate(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, Root<Order> orderRoot, List<BusinessDto> businessesDto) {
        Join<Order, Business> orderBusinessJoin = orderRoot.join("businesses");
        predicates.add(orderBusinessJoin.in(businessesDto));
    }


    public OrderDto toDto(Order order) {

        List<OrderItemsDto> orderItems = null;
        if(order.getOrderItems() != null){
            orderItems = order.getOrderItems().stream()
                    .map(orderItemsMapper::toDto)
                    .collect(Collectors.toList());
        }

        return OrderDto.builder()
                .id(order.getId())
                .product(order.getProduct())
                .paper(order.getPaper())
                .size(order.getSize())
                .sizeCategory(order.getSizeCategory())
                .gsm(order.getGsm())
                .quantity(order.getQuantity())
                .amount(order.getAmount())
                .jobColorsFront(order.getJobColorsFront())
                .sideOptionValue(order.getSideOptionValue())
                .impositionValue(order.getImpositionValue())
                .jobColorsBack(order.getJobColorsBack())
                .providedDesign(order.getProvidedDesign())
                .url(order.getUrl())
                .ctpProcess(order.getCtpProcess())
                .pressMachineProcess(order.getPressMachineProcess())
                .paperMarketProcess(order.getPaperMarketProcess())
                .production(order.getProduction())
                .designer(order.getDesigner())
                .plateSetter(order.getPlateSetter())
                .status(order.getStatus())
                .timeStamp(order.getTimeStamp())
                .assignedBy(order.getAssignedBy())
                .productRule(order.getProductRule())
                .createdBy(order.getCreatedBy())
                .type(order.getType())
                .customer(customerRepository.findById(order.getCustomer().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Customer not found")))
                .orderItems(orderItems)
                .build();
    }

    public Order toEntity(OrderDto orderDto) {

        List<OrderItems> orderItems = null;
        if(orderDto.getOrderItems() != null){
            orderItems = orderDto.getOrderItems().stream()
                    .map(orderItemsMapper::toEntity)
                    .collect(Collectors.toList());
        }

        return Order.builder()
                .id(orderDto.getId())
                .product(orderDto.getProduct())
                .paper(orderDto.getPaper())
                .size(orderDto.getSize())
                .sizeCategory(orderDto.getSizeCategory())
                .gsm(orderDto.getGsm())
                .quantity(orderDto.getQuantity())
                .amount(orderDto.getAmount())
                .jobColorsFront(orderDto.getJobColorsFront())
                .sideOptionValue(orderDto.getSideOptionValue())
                .impositionValue(orderDto.getImpositionValue())
                .jobColorsBack(orderDto.getJobColorsBack())
                .providedDesign(orderDto.getProvidedDesign())
                .url(orderDto.getUrl())
                .production(orderDto.getProduction())
                .designer(orderDto.getDesigner())
                .plateSetter(orderDto.getPlateSetter())
                .status(orderDto.getStatus())
                .timeStamp(orderDto.getTimeStamp())
                .productRule(orderDto.getProductRule())
                .assignedBy(orderDto.getAssignedBy())
                .createdBy(orderDto.getCreatedBy())
                .type(orderDto.getType())
                .customer(customerRepository.findById(orderDto.getCustomer().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Customer not found")))
                .orderItems(orderItems)
                .build();
    }
}
