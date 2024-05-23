package com.PrintLab.service.impl;

import com.PrintLab.Mapper.BusinessAndBranchMapper;
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

import static org.hibernate.tool.schema.SchemaToolingLogging.LOGGER;

@Service
public class OrderServiceImpl implements OrderService {

    private final CustomerRepository customerRepository;
    private final BusinessRepository businessRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;
    private final EmailUtils emailUtils;
    private final OrderItemsMapper orderItemsMapper;
    private final BusinessAndBranchMapper businessAndBranchMapper;

    public OrderServiceImpl(OrderRepository orderRepository, CustomerRepository customerRepository, BusinessRepository businessRepository, EntityManager entityManager, UserRepository userRepository, EmailUtils emailUtils, OrderItemsMapper orderItemsMapper, BusinessAndBranchMapper businessAndBranchMapper) {
        this.customerRepository = customerRepository;
        this.businessRepository = businessRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
        this.emailUtils = emailUtils;
        this.orderItemsMapper = orderItemsMapper;
        this.businessAndBranchMapper = businessAndBranchMapper;
    }


    @Override
    @Transactional
    public OrderDto save(OrderDto orderDto, Long loggedInUserId) {
        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new RecordNotFoundException("User not found at id: " + loggedInUserId));
        if (orderDto.getType().equalsIgnoreCase("auto")) {
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
                existingOrder.setBusinessCategory(orderDto.getBusinessCategory());
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
            }
            updateBusinesses(existingOrder, orderDto);
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

    public PaginationResponse getAllPaginatedOrders(Integer pageNumber, Integer pageSize, OrderDto searchCriteria) {
        // Create a Pageable object to handle pagination
        Pageable page = PageRequest.of(pageNumber, pageSize);

        // Create a CriteriaBuilder instance from the entity manager
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        // Create a CriteriaQuery object for the Order entity
        CriteriaQuery<Order> cq = criteriaBuilder.createQuery(Order.class);

        // Define the root of the query (the Order entity)
        Root<Order> orderRoot = cq.from(Order.class);

        // Build the predicates based on the search criteria
        List<Predicate> predicates = buildPredicates(criteriaBuilder, orderRoot, cq, searchCriteria);

        // Set the where clause of the query with the predicates
        cq.where(predicates.toArray(new Predicate[0]));

        // Set the order by clause to order by id in descending order
        cq.orderBy(criteriaBuilder.desc(orderRoot.get("id")));

        // Log the generated predicates for debugging
        LOGGER.info("Generated Predicates: " + predicates);

        // Create a TypedQuery instance to execute the query
        TypedQuery<Order> query = entityManager.createQuery(cq);

        // Apply pagination to the query
        applyPagination(query, pageNumber, pageSize);

        // Execute the query and get the result list
        List<Order> resultList = query.getResultList();

        // Count the total number of elements that match the criteria
        Long totalElements = countTotalElements(criteriaBuilder, searchCriteria);

        // Map the result list to DTOs
        List<OrderDto> dtoList = mapToDto(resultList);

        // Log the result list for debugging
        LOGGER.info("Result List: " + resultList);

        // Create and return the pagination response
        return createPaginationResponse(dtoList, pageNumber, pageSize, totalElements);
    }


    // Method to apply pagination settings to the query
    private void applyPagination(TypedQuery<?> query, Integer pageNumber, Integer pageSize) {
        // Calculate the index of the first result to retrieve for the current page
        int firstResult = pageNumber * pageSize;
        // Set the position of the first result to retrieve
        query.setFirstResult(firstResult);
        // Set the maximum number of results to retrieve (page size)
        query.setMaxResults(pageSize);
    }

    // Method to create a PaginationResponse object with paginated data and metadata
    private PaginationResponse createPaginationResponse(List<OrderDto> dtoList, Integer pageNumber, Integer pageSize, Long totalElements) {
        // Initialize a new PaginationResponse object
        PaginationResponse paginationResponse = new PaginationResponse();
        // Set the content (list of OrderDto objects) for the current page
        paginationResponse.setContent(dtoList);
        // Set the current page number
        paginationResponse.setPageNumber(pageNumber);
        // Set the size of each page (number of records per page)
        paginationResponse.setPageSize(pageSize);
        // Set the total number of elements (records) that match the search criteria
        paginationResponse.setTotalElements(totalElements.intValue());
        // Calculate the total number of pages by dividing totalElements by pageSize and rounding up
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);
        // Set the total number of pages
        paginationResponse.setTotalPages(totalPages);
        // Set the lastPage flag to true if the current page is the last page
        paginationResponse.setLastPage(pageNumber >= totalPages - 1);

        // Return the populated PaginationResponse object
        return paginationResponse;
    }


    // Method to map a list of Order entities to a list of OrderDto objects
    // Method to map a list of Order entities to a list of OrderDto objects
    private List<OrderDto> mapToDto(List<Order> orderList) {
        return orderList.stream()
                // Sort the Order entities based on their timestamps in descending order
                .sorted(Comparator.comparing(Order::getId).reversed())
                // Map each sorted Order entity to its corresponding OrderDto object using the toDto method
                .map(this::toDto)
                // Collect the mapped OrderDto objects into a list
                .collect(Collectors.toList());
    }


    // Method to count the total number of elements (records) that match the search criteria
    private Long countTotalElements(CriteriaBuilder criteriaBuilder, OrderDto searchCriteria) {
        // Create a CriteriaQuery for Long to perform a count query
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        // Create a root for the Order entity
        Root<Order> root = countQuery.from(Order.class);
        // Select the count of distinct entities
        countQuery.select(criteriaBuilder.countDistinct(root));

        // Build predicates based on the search criteria
        List<Predicate> predicates = buildPredicates(criteriaBuilder, root, countQuery, searchCriteria);
        // Add the predicates to the countQuery
        countQuery.where(predicates.toArray(new Predicate[0]));

        // Execute the countQuery and return the result (total count of matching records)
        return entityManager.createQuery(countQuery).getSingleResult();
    }


    // Method to build predicates based on the search criteria provided
    private List<Predicate> buildPredicates(CriteriaBuilder criteriaBuilder, Root<Order> orderRoot, CriteriaQuery<?> criteriaQuery, OrderDto searchCriteria) {
        List<Predicate> predicates = new ArrayList<>();

        // Add like predicates for string attributes if they are present in the search criteria
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getBusinessCategory(), orderRoot.get("businessCategory"));
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getProduct(), orderRoot.get("product"));
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getStatus(), orderRoot.get("status"));
        addLikePredicateIfPresent(criteriaBuilder, predicates, searchCriteria.getType(), orderRoot.get("type"));

        // Add a predicate to filter by the user who created the order, if createdBy field is present in the search criteria
        if (searchCriteria.getCreatedBy() != null && searchCriteria.getCreatedBy().getName() != null) {
            addCreatedByPredicate(criteriaBuilder, predicates, orderRoot, searchCriteria.getCreatedBy());
        }

        // Add a predicate to filter by timestamp, if timeStamp field is present in the search criteria
        if (searchCriteria.getTimeStamp() != null) {
            addTimeStampPredicate(criteriaBuilder, predicates, orderRoot, searchCriteria.getTimeStamp());
        }

        // Add a predicate to filter by business names, if businesses field is present in the search criteria
        if (searchCriteria.getBusinesses() != null && !searchCriteria.getBusinesses().isEmpty()) {
            addBusinessPredicate(criteriaBuilder, criteriaQuery, predicates, orderRoot, searchCriteria.getBusinesses());
        }

        return predicates;
    }

    // Method to add a like predicate to the list of predicates if the value is present
    private void addLikePredicateIfPresent(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, String value, Path<String> path) {
        if (value != null && !value.trim().isEmpty()) {
            predicates.add(criteriaBuilder.like(path, "%" + value + "%"));
        }
    }

    // Method to add a predicate to filter by the user who created the order
    private void addCreatedByPredicate(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, Root<Order> orderRoot, User createdBy) {
        Join<Order, User> createdByJoin = orderRoot.join("createdBy");
        predicates.add(criteriaBuilder.like(createdByJoin.get("name"), "%" + createdBy.getName() + "%"));
    }

    // Method to add a predicate to filter by timestamp
    private void addTimeStampPredicate(CriteriaBuilder criteriaBuilder, List<Predicate> predicates, Root<Order> orderRoot, LocalDateTime timeStamp) {
        LocalDate userEnteredDate = timeStamp.toLocalDate();
        LocalDate currentLocalDate = LocalDate.now();
        predicates.add(criteriaBuilder.between(orderRoot.get("timeStamp").as(LocalDate.class), userEnteredDate, currentLocalDate));
    }

    // Method to add a predicate to filter by business names
    private void addBusinessPredicate(CriteriaBuilder criteriaBuilder, CriteriaQuery<?> criteriaQuery, List<Predicate> predicates, Root<Order> orderRoot, List<BusinessDto> businessesDto) {
        if (businessesDto != null && !businessesDto.isEmpty()) {
            Join<Order, Business> orderBusinessJoin = orderRoot.join("businesses");

            List<String> businessNames = businessesDto.stream()
                    .map(BusinessDto::getBusinessName)
                    .collect(Collectors.toList());

            // Make the query distinct
            criteriaQuery.distinct(true);

            // Add the predicate to filter by business names
            predicates.add(orderBusinessJoin.get("businessName").in(businessNames));
        }
    }


    public OrderDto toDto(Order order) {

        List<OrderItemsDto> orderItems = null;
        if (order.getOrderItems() != null) {
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
                .businessCategory(order.getBusinessCategory())
                .rate(order.getRate())
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
                .description(order.getDescription())
                .plateSetter(order.getPlateSetter())
                .status(order.getStatus())
                .timeStamp(order.getTimeStamp())
                .assignedBy(order.getAssignedBy())
                .productRule(order.getProductRule())
                .createdBy(order.getCreatedBy())
                .type(order.getType())
                .customer(customerRepository.findById(order.getCustomer().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Customer not found")))
                .businesses(order.getBusinesses().stream()
                        .map(businessAndBranchMapper::toBusinessDto)
                        .collect(Collectors.toList()))
                .orderItems(orderItems)
                .build();
    }

    public Order toEntity(OrderDto orderDto) {

        List<OrderItems> orderItems = null;
        if (orderDto.getOrderItems() != null) {
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
                .rate(orderDto.getRate())
                .description(orderDto.getDescription())
                .businessCategory(orderDto.getBusinessCategory())
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
                .businesses(orderDto.getBusinesses().stream()
                        .map(businessAndBranchMapper::toBusinessEntity)
                        .collect(Collectors.toList()))
                .orderItems(orderItems)
                .build();
    }
}
