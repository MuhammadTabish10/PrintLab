package com.PrintLab.controller;

import com.PrintLab.dto.OrderDto;
import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.model.Order;
import com.PrintLab.service.OrderService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/order")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER_SUPPORT')")
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto, @RequestParam Long loggedInUser) {
        return ResponseEntity.ok(orderService.save(orderDto, loggedInUser));
    }

    @GetMapping("/order")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER','ROLE_CUSTOMER_SUPPORT')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orderList = orderService.getAll();
        return ResponseEntity.ok(orderList);
    }

    @GetMapping("/order/{id}")
    @PreAuthorize("hasAnyRole(" +
            "'ROLE_ADMIN', 'ROLE_PRODUCTION', " +
            "'ROLE_DESIGNER', 'ROLE_PLATE_SETTER'," +
            "'ROLE_CUSTOMER_SUPPORT'" +
            ")")
    public ResponseEntity<OrderDto> getOrderById(
            @PathVariable Long id,
            @RequestParam String type
    ) {
        OrderDto orderDto = orderService.findByIdAndType(id, type);
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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER_SUPPORT')")
    public ResponseEntity<OrderDto> assignUserToOrder(
            @RequestParam Long orderId,
            @RequestParam Long userId,
            @RequestParam String role,
            @RequestParam Long loggedInUser
    ) {

        OrderDto assignedUser = orderService.assignOrderToUser(orderId, userId, role, loggedInUser);
        return ResponseEntity.ok(assignedUser);
    }

    @GetMapping("/assigned-orders")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<List<Order>> getAllAssignedOrders() {
        List<Order> orderList = orderService.getAssignedOrdersForLoggedInUser();
        return ResponseEntity.ok(orderList);
    }

    @PutMapping("/order/{process}/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<String> rejected(@PathVariable Long id, @RequestBody Boolean rejected) {
        orderService.reject(id, rejected);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/get-paginated-orders")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaginationResponse> findAll(
            @RequestParam(value = "page-number", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "page-size", defaultValue = "10", required = false) Integer pageSize,
            @RequestBody OrderDto orderDto
    ) {
        PaginationResponse paginationResponse = orderService.getAllPaginatedOrders(pageNumber, pageSize, orderDto);
        return ResponseEntity.ok(paginationResponse);
    }


    @GetMapping("/order/pdf/{fileName}/{id}")
    public ResponseEntity<byte[]> getOrderConfirmationPdf(
            @PathVariable String fileName,
            @PathVariable Long id
    ) {
        try {
            byte[] pdf = orderService.downloadOrderConfirmationPdf(fileName, id);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().filename(fileName + ".pdf").build());
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }

}
