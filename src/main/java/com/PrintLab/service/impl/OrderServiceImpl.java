package com.PrintLab.service.impl;

import com.PrintLab.dto.OrderDto;

import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Order;
import com.PrintLab.model.User;
import com.PrintLab.repository.CustomerRepository;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.repository.UserRepository;
import com.PrintLab.service.OrderService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public OrderServiceImpl(OrderRepository orderRepository, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
    }


    @Override
    @Transactional
    public OrderDto save(OrderDto orderDto) {
        if(orderDto.getSideOptionValue() == null){
            orderDto.setSideOptionValue("SINGLE_SIDED");
        }
        if(!orderDto.getImpositionValue() && orderDto.getSideOptionValue().equals("DOUBLE_SIDED")){
            if(orderDto.getJobColorsFront() == null){
                orderDto.setJobColorsFront(1L);
            }
            if(orderDto.getJobColorsBack() == null){
                orderDto.setJobColorsBack(1L);
            }
        }
        else if(orderDto.getImpositionValue() && orderDto.getSideOptionValue().equals("DOUBLE_SIDED")){
            if(orderDto.getJobColorsFront() == null){
                orderDto.setJobColorsFront(1L);
            }
        }
        else if(orderDto.getSideOptionValue().equals("SINGLE_SIDED")){
            if(orderDto.getJobColorsFront() == null){
                orderDto.setJobColorsFront(1L);
            }
        }
        if(orderDto.getQuantity() == null){
            orderDto.setQuantity(1000.0);
        }
        Order order = orderRepository.save(toEntity(orderDto));
        return toDto(order);
    }

    @Override
    public List<OrderDto> getAll() {
        List<Order> orderList = orderRepository.findAllInDescendingOrderById();
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
                    .orElseThrow(()-> new RecordNotFoundException("Customer not found at id => " + orderDto.getCustomer().getId())));

            Order updatedOrder = orderRepository.save(existingOrder);
            return toDto(updatedOrder);
        } else {
            throw new RecordNotFoundException(String.format("Order not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public OrderDto assignOrderToUser(Long orderId, Long userId, String role) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RecordNotFoundException("Order not found at id: " + orderId));

        if(role.equalsIgnoreCase("ROLE_PRODUCTION")){
            order.setProduction(userId);
        }
        else if(role.equalsIgnoreCase("ROLE_DESIGNER")){
            order.setDesigner(userId);
        }
        else if (role.equalsIgnoreCase("ROLE_PLATE_SETTER")) {
            order.setPlateSetter(userId);
        }
        orderRepository.save(order);
        return toDto(order);
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
                .production(order.getProduction())
                .designer(order.getDesigner())
                .plateSetter(order.getPlateSetter())
                .customer(customerRepository.findById(order.getCustomer().getId())
                        .orElseThrow(()-> new RecordNotFoundException("Customer not found")))
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
                .customer(customerRepository.findById(orderDto.getCustomer().getId())
                        .orElseThrow(()-> new RecordNotFoundException("Customer not found")))
                .build();
    }
}
