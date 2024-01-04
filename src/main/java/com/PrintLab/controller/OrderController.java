package com.PrintLab.controller;

import com.PrintLab.dto.OrderDto;
import com.PrintLab.model.Order;
import com.PrintLab.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController
{
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/order")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto) {
        return ResponseEntity.ok(orderService.save(orderDto));
    }

    @GetMapping("/order")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orderList = orderService.getAll();
        return ResponseEntity.ok(orderList);
    }

    @GetMapping("/order/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto orderDto = orderService.findById(id);
        return ResponseEntity.ok(orderDto);
    }

    @GetMapping("order/products/{product}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<List<OrderDto>> getAllOrdersByProduct(@PathVariable String product) {
        List<OrderDto> orderDtoList = orderService.searchByProduct(product);
        return ResponseEntity.ok(orderDtoList);
    }

    @DeleteMapping("/order/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order/ctp-process/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> markCtpAsDone(@PathVariable Long id,
                                                @RequestParam(name = "isDone") Boolean isDone) {
        orderService.updateCtpProcess(id, isDone);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order/paper-market-process/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> markPaperMarketAsDone(@PathVariable Long id,
                                                        @RequestParam(name = "isDone") Boolean isDone) {
        orderService.updatePaperMarketProcess(id, isDone);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order/press-machine-process/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> markPressMachineAsDone(@PathVariable Long id,
                                                         @RequestParam(name = "isDone") Boolean isDone) {
        orderService.updatePressMachineProcess(id, isDone);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderDto> updateOrder(@PathVariable Long id, @RequestBody OrderDto orderDto) {
        OrderDto updatedOrderDto = orderService.updateOrder(id, orderDto);
        return ResponseEntity.ok(updatedOrderDto);
    }

    @PostMapping("/order/assignUser")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderDto> assignUserToOrder(
            @RequestParam Long orderId,
            @RequestParam Long userId,
            @RequestParam String role) {

        OrderDto assignedUser = orderService.assignOrderToUser(orderId, userId, role);
        return ResponseEntity.ok(assignedUser);
    }

    @GetMapping("/assigned-orders")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<List<Order>> getAllAssignedOrders() {
        List<Order> orderList = orderService.getAssignedOrdersForLoggedInUser();
        return ResponseEntity.ok(orderList);
    }
}
