package com.PrintLab.controller;

import com.PrintLab.dto.OrderDto;
import com.PrintLab.dto.OrderPaymentHistoryDto;
import com.PrintLab.service.OrderPaymentHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderPaymentHistoryController {

    private final OrderPaymentHistoryService orderPaymentHistoryService;

    public OrderPaymentHistoryController(OrderPaymentHistoryService orderPaymentHistoryService) {
        this.orderPaymentHistoryService = orderPaymentHistoryService;
    }

    @PostMapping("/orderPaymentHistory")
    public ResponseEntity<OrderPaymentHistoryDto> createOrderHistory(@RequestBody OrderPaymentHistoryDto orderPaymentHistoryDto) {
        return ResponseEntity.ok(orderPaymentHistoryService.save(orderPaymentHistoryDto));
    }

    @GetMapping("/orderPaymentHistory")
    public ResponseEntity<List<OrderPaymentHistoryDto>> getAllOrderPaymentHistories() {
        List<OrderPaymentHistoryDto> orderList = orderPaymentHistoryService.getAll();
        return ResponseEntity.ok(orderList);
    }

    @GetMapping("/orderPaymentHistory/{id}")
    public ResponseEntity<OrderPaymentHistoryDto> getOrderPaymentHistoryById(@PathVariable Long id) {
        OrderPaymentHistoryDto orderDto = orderPaymentHistoryService.findById(id);
        return ResponseEntity.ok(orderDto);
    }

    @GetMapping("/orderPaymentHistory-name/{name}")
    public ResponseEntity<OrderPaymentHistoryDto> getOrderPaymentHistoryByName(@PathVariable String name) {
        OrderPaymentHistoryDto orderDto = orderPaymentHistoryService.findByName(name);
        return ResponseEntity.ok(orderDto);
    }

    @DeleteMapping("/orderPaymentHistory/{id}")
    public void deleteOrderPaymentHistoryById(@PathVariable Long id) {
        orderPaymentHistoryService.deleteById(id);
        ResponseEntity.ok();
    }

    @PutMapping("/orderPaymentHistory/{id}")
    public ResponseEntity<OrderPaymentHistoryDto> updateOrderPaymentHistoryById(@PathVariable Long id, @RequestBody OrderPaymentHistoryDto orderPaymentHistoryDto) {
        OrderPaymentHistoryDto updatedOrderDto = orderPaymentHistoryService.updateById(id, orderPaymentHistoryDto);
        return ResponseEntity.ok(updatedOrderDto);
    }
}
