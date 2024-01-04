package com.PrintLab.service;

import com.PrintLab.dto.OrderDto;
import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.model.Order;
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
    OrderDto assignOrderToUser(Long orderId, Long userId, String role);
    List<Order> getAssignedOrdersForLoggedInUser();
    void updateCtpProcess(Long id, Boolean isDone);
    void updatePaperMarketProcess(Long id, Boolean isDone);
    void updatePressMachineProcess(Long id, Boolean isDone);
}


