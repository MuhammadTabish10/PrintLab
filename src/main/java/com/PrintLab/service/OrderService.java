package com.PrintLab.service;

import com.PrintLab.dto.OrderDto;

import java.util.List;

public interface OrderService
{
    OrderDto save(OrderDto orderDto);
    List<OrderDto> getAll();
    OrderDto findById(Long id);
    String deleteById(Long id);
    OrderDto updateOrder(Long id, OrderDto orderDto);
}
