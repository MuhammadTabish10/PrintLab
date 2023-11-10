package com.PrintLab.service;

import com.PrintLab.dto.OrderDto;
import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.model.User;

import java.util.List;

public interface OrderService
{
    OrderDto save(OrderDto orderDto);
    List<OrderDto> getAll();
    List<OrderDto> searchByProduct(String product);
    OrderDto findById(Long id);
    String deleteById(Long id);
    OrderDto updateOrder(Long id, OrderDto orderDto);
    User assignOrderToUser(Long orderId, Long userId, String role);
}
