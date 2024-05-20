package com.PrintLab.service;

import com.PrintLab.dto.OrderDto;
import com.PrintLab.model.Order;

import java.util.List;

public interface OrderService {
    OrderDto save(OrderDto orderDto,Long loggedInUserId);

    List<OrderDto> getAll();

    List<OrderDto> searchByProduct(String product);

    OrderDto findByIdAndType(Long id,String type);

    String deleteById(Long id);

    OrderDto updateOrder(Long id, OrderDto orderDto);

    OrderDto assignOrderToUser(Long orderId, Long userId, String role, Long logedInUser);

    List<Order> getAssignedOrdersForLoggedInUser();

    void updateCtpProcess(Long id, Boolean isDone);
    void updatePaperMarketProcess(Long id, Boolean isDone);
    void updatePressMachineProcess(Long id, Boolean isDone);

    void reject(Long id, Boolean rejected);
}


