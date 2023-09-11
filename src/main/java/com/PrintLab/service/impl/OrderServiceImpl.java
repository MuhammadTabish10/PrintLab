package com.PrintLab.service.impl;

import com.PrintLab.dto.OrderDto;

import com.PrintLab.dto.SettingDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.Order;
import com.PrintLab.modal.Setting;
import com.PrintLab.repository.CustomerRepository;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.service.OrderService;
import org.springframework.stereotype.Service;

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
    public OrderDto save(OrderDto orderDto) {
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
    public OrderDto updateOrder(Long id, OrderDto orderDto) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order existingOrder = optionalOrder.get();
            existingOrder.setProduct(orderDto.getProduct());
            existingOrder.setPaper(orderDto.getPaper());
            existingOrder.setSize(orderDto.getSize());
            existingOrder.setSheetSizeValue(orderDto.getSheetSizeValue());
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

    public OrderDto toDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .product(order.getProduct())
                .paper(order.getPaper())
                .size(order.getSize())
                .sheetSizeValue(order.getSheetSizeValue())
                .gsm(order.getGsm())
                .quantity(order.getQuantity())
                .price(order.getPrice())
                .jobColorsFront(order.getJobColorsFront())
                .sideOptionValue(order.getSideOptionValue())
                .impositionValue(order.getImpositionValue())
                .jobColorsBack(order.getJobColorsBack())
                .providedDesign(order.getProvidedDesign())
                .url(order.getUrl())
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
                .sheetSizeValue(orderDto.getSheetSizeValue())
                .gsm(orderDto.getGsm())
                .quantity(orderDto.getQuantity())
                .price(orderDto.getPrice())
                .jobColorsFront(orderDto.getJobColorsFront())
                .sideOptionValue(orderDto.getSideOptionValue())
                .impositionValue(orderDto.getImpositionValue())
                .jobColorsBack(orderDto.getJobColorsBack())
                .providedDesign(orderDto.getProvidedDesign())
                .url(orderDto.getUrl())
                .customer(customerRepository.findById(orderDto.getCustomer().getId())
                        .orElseThrow(()-> new RecordNotFoundException("Customer not found")))
                .build();
    }
}
