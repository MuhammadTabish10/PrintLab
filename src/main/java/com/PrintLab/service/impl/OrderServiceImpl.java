package com.PrintLab.service.impl;

import com.PrintLab.dto.OrderDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.CustomUserDetail;
import com.PrintLab.model.Order;
import com.PrintLab.model.Role;
import com.PrintLab.model.User;
import com.PrintLab.repository.CustomerRepository;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.repository.UserRepository;
import com.PrintLab.service.OrderService;
import com.PrintLab.utils.EmailUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final EmailUtils emailUtils;

    public OrderServiceImpl(OrderRepository orderRepository, CustomerRepository customerRepository, UserRepository userRepository, EmailUtils emailUtils) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.emailUtils = emailUtils;
    }


    @Override
    @Transactional
    public OrderDto save(OrderDto orderDto) {
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

        orderDto.setStatus(true);
        orderDto.setCtpProcess(false);
        orderDto.setPressMachineProcess(false);
        orderDto.setPaperMarketProcess(false);
        Order order = orderRepository.save(toEntity(orderDto));
        return toDto(order);
    }

    @Override
    public List<OrderDto> getAll() {
        List<Order> orderList = orderRepository.findAllInDesOrderByIdAndStatus();
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
    public OrderDto findById(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

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
            Order order = optionalOrder.get();
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
            existingOrder.setProduct(orderDto.getProduct());
            existingOrder.setPaper(orderDto.getPaper());
            existingOrder.setSize(orderDto.getSize());
            existingOrder.setCategory(orderDto.getCategory());
            existingOrder.setGsm(orderDto.getGsm());
            existingOrder.setQuantity(orderDto.getQuantity());
            existingOrder.setPrice(orderDto.getPrice());
            existingOrder.setJobColorsFront(orderDto.getJobColorsFront());
            existingOrder.setSideOptionValue(orderDto.getSideOptionValue());
            existingOrder.setImpositionValue(orderDto.getImpositionValue());
            existingOrder.setJobColorsBack(orderDto.getJobColorsBack());
            existingOrder.setProvidedDesign(orderDto.getProvidedDesign());
            existingOrder.setUrl(orderDto.getUrl());
            existingOrder.setCustomer(customerRepository.findById(orderDto.getCustomer().getId())
                    .orElseThrow(() -> new RecordNotFoundException("Customer not found at id => " + orderDto.getCustomer().getId())));

            Order updatedOrder = orderRepository.save(existingOrder);
            return toDto(updatedOrder);
        } else {
            throw new RecordNotFoundException(String.format("Order not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public OrderDto assignOrderToUser(Long orderId, Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RecordNotFoundException("User not found at id: " + userId));

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
    public void updateCtpProcess(Long id) {
        orderRepository.setCtpMarkAsDone(id);
    }

    @Override
    @Transactional
    public void updatePaperMarketProcess(Long id) {
        orderRepository.setPaperMarketProcessProcessMarkAsDone(id);
    }

    @Override
    @Transactional
    public void updatePressMachineProcess(Long id) {
        orderRepository.setPressMachineProcessMarkAsDone(id);
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


    public OrderDto toDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .product(order.getProduct())
                .paper(order.getPaper())
                .size(order.getSize())
                .category(order.getCategory())
                .gsm(order.getGsm())
                .quantity(order.getQuantity())
                .price(order.getPrice())
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
                .productRule(order.getProductRule())
                .customer(customerRepository.findById(order.getCustomer().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Customer not found")))
                .build();
    }

    public Order toEntity(OrderDto orderDto) {
        return Order.builder()
                .id(orderDto.getId())
                .product(orderDto.getProduct())
                .paper(orderDto.getPaper())
                .size(orderDto.getSize())
                .category(orderDto.getCategory())
                .gsm(orderDto.getGsm())
                .quantity(orderDto.getQuantity())
                .price(orderDto.getPrice())
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
                .productRule(orderDto.getProductRule())
                .customer(customerRepository.findById(orderDto.getCustomer().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Customer not found")))
                .build();
    }
}
