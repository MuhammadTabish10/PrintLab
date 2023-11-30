package com.PrintLab.controller;

import com.PrintLab.dto.OrderTransactionDto;
import com.PrintLab.service.OrderTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderTransactionController {
    private final OrderTransactionService orderTransactionService;

    public OrderTransactionController(OrderTransactionService orderTransactionService) {
        this.orderTransactionService = orderTransactionService;
    }

    @PostMapping("/order-transaction")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<OrderTransactionDto> createOrderTransaction(@RequestBody OrderTransactionDto orderTransactionDto) {
        return ResponseEntity.ok(orderTransactionService.save(orderTransactionDto));
    }

    @GetMapping("/order-transaction")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<List<OrderTransactionDto>> getAllOrderTransactions() {
        List<OrderTransactionDto> orderTransactionList = orderTransactionService.getAll();
        return ResponseEntity.ok(orderTransactionList);
    }

    @GetMapping("/order-transaction/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<OrderTransactionDto> getOrderTransactionById(@PathVariable Long id) {
        OrderTransactionDto orderTransactionDto = orderTransactionService.findById(id);
        return ResponseEntity.ok(orderTransactionDto);
    }

    @GetMapping("/order-transaction/order/{order-id}/process/{process-type}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<HashMap<String,Object>> getPurchaseOrder(@PathVariable(name = "order-id") Long orderId,
                                                                          @PathVariable(name = "process-type") String processType) {

        HashMap<String,Object> purchaseOrder = orderTransactionService.getOrderProcess(orderId,processType);
        return ResponseEntity.ok(purchaseOrder);
    }

    @GetMapping("order-transaction/plate-dimension/{plate-dimension}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<List<OrderTransactionDto>> getAllOrderTransactionByPlateDimension(@PathVariable(name = "plate-dimension") String plateDimension) {
        List<OrderTransactionDto> orderTransactionDtoList = orderTransactionService.searchByPlateDimension(plateDimension);
        return ResponseEntity.ok(orderTransactionDtoList);
    }

    @DeleteMapping("/order-transaction/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<String> deleteOrderTransaction(@PathVariable Long id) {
        orderTransactionService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order-transaction/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<OrderTransactionDto> updateOrderTransaction(@PathVariable Long id, @RequestBody OrderTransactionDto orderTransactionDto) {
        OrderTransactionDto updatedOrderTransactionDto = orderTransactionService.update(id, orderTransactionDto);
        return ResponseEntity.ok(updatedOrderTransactionDto);
    }
}
